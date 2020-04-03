import React, { Component } from 'react';
import './App.scss';
import InfiniteScroll from "react-infinite-scroll-component";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesData: [],
      gridViewOptions: [{ key: 'two', value: 2 }, { key: 'three', value: 3 }, { key: 'four', value: 4 }],
      selectedGridViewOption: { key: 'two', value: 2 },
      searchText: ''
    };
    this.getSearchData = this.getSearchData.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * This function will get the data by making an api call when user is online else it would fetch the from 
   * local storage
   */
  getSearchData(isResetImagesData = true) {
    return () => {
      this.fetchSearchResult();
    }
  }

  fetchSearchResult(isResetImagesData) {
    if (navigator.onLine && this.state.searchText) {
      fetch(`https://api.unsplash.com/search/photos?client_id=eJmS2hWCX__ewbRigkcQDxEql5rkOc5eEyanaapS6iU&page=3&query=${this.state.searchText}`,
        {
          method: 'get',
          mode: 'cors',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(jsonResponse => {
          this.setState((state) => ({
            imagesData: isResetImagesData ? jsonResponse.results : state.imagesData.concat(jsonResponse.results)
          }), () => {
            localStorage.setItem(this.state.searchText, JSON.stringify(this.state.imagesData));
          });
        });
    } else {
      if (this.state.searchText && JSON.parse(localStorage.getItem(this.state.searchText))) {
        this.setState({
          imagesData: JSON.parse(localStorage.getItem(this.state.searchText))
        })
      }
    }
  }

  /**
   * This function will triggered when user click enter in search field and it will trigger the
   * getSearchData function
   * @param {*} event 
   */
  handleKeyPress(event) {
    switch (event.key) {
      case 'Enter':
        this.fetchSearchResult(true);
        event.preventDefault();
        break;
      default:
        break;
    }
    event.stopPropagation();
  }

  /**
   * This function will set the grid option view that the user has selected
   * @param {*} option 
   */
  setSelectedOption(option) {
    return () => {
      this.setState({
        selectedGridViewOption: option
      })
    }
  }

  onInputChange(event) {
    this.setState({
      searchText: event.target.value
    });
  }

  render() {
    return (
      <div className="main-app-container md-text13">
        <div className="App-header">
          <div className="md-f500">Search Engine</div>
        </div>
        <div className="app-inner-container">
          <div className="search-bar-container">
            <input
              type="text"
              value={this.state.searchText}
              onChange={(e) => this.onInputChange(e)}
              onKeyDown={this.handleKeyPress}
              placeholder="Enter the value"
              className="search-input"></input>
            <div className="search-cta md-f500 cp" onClick={this.getSearchData()}>Search</div>
          </div>

          {
            !!this.state.imagesData.length && (
              <div>
                <div className="md-f500 options-container hidden-xs">
                  <div className="md-f500">View by columns</div>
                  {
                    !!this.state.gridViewOptions.length && this.state.gridViewOptions.map((option, index) => (
                      <div className={`dfr options cp ${this.state.selectedGridViewOption.value === option.value ? 'active' : ''}`} key={index} onClick={this.setSelectedOption(option)}>
                        <div className="radio-button">
                          <div className="filled-circle"></div>
                        </div>
                        <div>{option.value}</div>
                      </div>
                    ))
                  }
                </div>
                <div className="main-image">
                  <InfiniteScroll
                    dataLength={this.state.imagesData.length}
                    next={this.getSearchData(false)}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                  >
                    {
                      this.state.imagesData.map((img, index) => (
                        <div className={`ibt image-container ${this.state.selectedGridViewOption.key}`} key={index}>
                          <img src={img && img.urls && img.urls.regular} className="images" alt={img && img.alt_description}></img>
                        </div>
                      ))
                    }
                  </InfiniteScroll>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
