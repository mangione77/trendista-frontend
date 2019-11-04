import React, { Component } from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector'

class Navigation extends Component {
    render() {
        const { 
            country, 
            region, 
            selectCountry, 
            selectRegion, 
            getTrendingInLocation, 
            searching 
        } = this.props
        return (
            <Navbar expand="lg" className="transparent">
                <Navbar.Brand href="#home">Trendista</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            country && region && searching
                                ? <Nav.Link>Location: {region}, {country}</Nav.Link>
                                : <div>
                                    <CountryDropdown
                                        value={country}
                                        onChange={(val) => selectCountry(val)} />
                                    <RegionDropdown
                                        country={country}
                                        value={region}
                                        onChange={(val) => selectRegion(val)} />
                                    <Button 
                                        variant="outline-success" 
                                        style={{ marginLeft: '10' }} 
                                        size="sm"
                                        onClick={getTrendingInLocation}
                                    >
                                            Search
                                    </Button>
                                </div>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation