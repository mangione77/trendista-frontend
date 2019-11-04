import React, { Component } from 'react'
import axios from 'axios'
import { Fade, } from 'react-bootstrap'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import './App.css'

import Navigation from './components/Navigation'
import Main from './components/Main'

class App extends Component {
  constructor() {
    super()

    this.state = {
      country: '',
      region: '',
      searching: false,
      trending: null,
      fadeMain: false
    }
  }

  selectCountry = (value) => {
    this.setState({
      country: value
    })
  }

  selectRegion = (value) => {
    this.setState({
      region: value
    })
  }

  getTrendingInLocation = async () => {
    try {
      const { country, region: city } = this.state
      this.setState({
        searching: true
      }, async () => {
        const postData = {
          location: {
            city,
            country
          }
        }
        const { data } = await axios.post('http://localhost:1337/trending/location', postData)
        const { trending } = data
        this.setState({
          trending: trending,
          fadeMain: true
        }, () => {
          console.log(this.state.trending)
        })
      })
    } catch (err) {
      console.log('GetTrendingInLocation: ', err)
    }
  }

  onSideNavClick = (e) => {
    const action = e.target.getAttribute('data-action')
    if (action === 'reset') {
      this.setState({
        city: '',
        region: '',
        searching: false,
        trending: null,
        fadeMain: false
      })
    } else {
      console.log('Export to csv....')
    }
  }

  render() {
    const { country, region, searching, trending, fadeMain } = this.state
    console.log('State: ', this.state)
    return (
      <div>
        <Navigation
          country={country}
          region={region}
          selectCountry={this.selectCountry}
          selectRegion={this.selectRegion}
          getTrendingInLocation={this.getTrendingInLocation}
          searching={searching}
        />
        {
          !trending
            ? null
            : <Fade in={fadeMain}>
              <>
                <SideNav className="sideNav">
                  <SideNav.Nav>
                    <NavItem eventKey="reset" className="mb-3 ml-3 clickable" onClick={this.onSideNavClick}>
                      <NavIcon>
                        <i className="fa fa-fw fa-repeat" data-action="reset" style={{ fontSize: '1.75em' }} />
                      </NavIcon>
                    </NavItem>
                    <NavItem eventKey="save" className="mb-3 ml-3 clickable" onClick={this.onSideNavClick}>
                      <i className="fa fa-fw fa-save" data-action="save" style={{ fontSize: '1.75em' }} />
                    </NavItem>
                  </SideNav.Nav>
                </SideNav>
                <Main
                  trending={trending}
                  country={country}
                  city={region}
                />
              </>
            </Fade>
        }
      </div>
    )
  }
}

export default App
