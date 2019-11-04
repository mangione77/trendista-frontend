import React, { Component } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'

class Main extends Component {
    constructor() {
        super()

        this.state = {
            selectedKeyword: ''
        }
    }

    onCardClick = (e) => {
        console.log('Clicked on card: ', e.target.getAttribute('data-key'))
        this.setState({
            selectedKeyword: e.target.getAttribute('data-key')
        }, () => {
            this.getLatestForKeyword(this.state.selectedKeyword)
        })
    }

    getLatestForKeyword = async (keyword) => {
        try {
            this.setState({
                fetchingData: true
            }, async () => {
                const { country, city } = this.props
                const postData = {
                    location: {
                        city,
                        country
                    },
                    keyword
                }
                const { data } = await axios.post('http://localhost:1337/trending/keyword', postData)
                const {
                    interestOverTime,
                    latestNews,
                    latestTweets,
                } = data
                this.setState({
                    keywordData: {
                        interestOverTime,
                        latestNews,
                        latestTweets: latestTweets.statuses
                    },
                    fetchingData: false
                })
            })
        } catch (err) {
            console.log('GetLatestForKeyword: ', err.message)
        }
    }

    render() {
        const { trending } = this.props
        const { keywordData } = this.state
        console.log('keyworddata: ', keywordData)
        return (
            <Container className="trending-results-container">
                <Row>
                    <Col lg={6} className="trending-results-col">
                        {
                            trending.length > 0
                                ? trending.map((item, index) => {
                                    let itemIndex = index + 1
                                    return (
                                        <Card
                                            className="trending-result-card clickable"
                                            key={item.name}
                                            onClick={this.onCardClick}
                                        >
                                            <Card.Title className="text-muted trendingtitle pt-1 pl-1">{itemIndex}. Trending</Card.Title>
                                            <Card.Subtitle className="pb-1 pl-1">{item.name}</Card.Subtitle>
                                            <a href="#" data-key={item.name} className="stretched-link" />
                                        </Card>
                                    )
                                })
                                : <p>Sorry, no results for your query.</p>
                        }
                    </Col>
                    <Col lg={6} className="trending-results-col">
                        {
                            !this.state.keywordData
                                ? this.state.fetchingData
                                    ? <Spinner animation="border" />
                                    : null
                                : this.state.keywordData.latestTweets.map(tweet => {
                                    const {
                                        user,
                                        text,
                                        created_at,
                                        favorite_count,
                                        retweet_count
                                    } = tweet
                                    return (
                                        <Card
                                            key={text + user.name}
                                            className="trending-result-card"
                                        >
                                            <Card.Subtitle className="pb-1 pl-1 pt-3">{user.name} <span className="text-muted screenname">@{user.screen_name}</span></Card.Subtitle>
                                            <Card.Text className="pb-3 pl-1 pt-1">
                                                {text} <br />
                                                <span className="retweets"> <i className="fa fa-retweet" aria-hidden="true"></i>{retweet_count}</span> <span className="favorites"><i className="fa fa-heart" aria-hidden="true"></i>{favorite_count}</span><br />
                                                <span className="createdat">{moment(created_at).fromNow()}</span> </Card.Text>
                                        </Card>
                                    )
                                })
                        }
                    </Col>
                </Row>
                <Row className="mt-3 mb-5">
                    <Col lg={12} className="latest-news-col">
                        {
                            !this.state.keywordData
                                ? this.state.fetchingData
                                    ? <Spinner animation="border" />
                                    : null
                                : this.state.keywordData.latestNews.map(article => {
                                    console.log('article: ', article)
                                    const {
                                        source,
                                        author,
                                        title,
                                        url,
                                        description,
                                        urlToImage,
                                        publishedAt
                                    } = article
                                    return (
                                        <Card
                                            className="latest-news-card clickable"
                                        >
                                            <Card.Title className="pt-1 pl-1 text-muted">{title}</Card.Title>
                                            <Card.Subtitle className="pl-1 pb-2 text-muted">{author} / {source.name}</Card.Subtitle>
                                            <Card.Text className="pl-1 pb-2">
                                                {description} <br/>
                                                <span className="createdat">{moment(publishedAt).fromNow()}</span>
                                            </Card.Text>
                                            <a href={url} target="_blank" className="stretched-link" />
                                        </Card>
                                    )
                                })
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Main