import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'

const Required = () => (
  <span className='UpdateBookmark__required'>*</span>
)

export default class UpdateBookmarkForm extends Component {

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

    constructor(props) {
        super(props);
        this.state = {
          id: '',
          title: '',
          url: '',
          description: '',
          rating: '',
          error: null
          }}

  updateBookmarkTitle = (e) => {
    this.setState({title: e.target.value});
  }
    
  updateBookmarkUrl = (url) => {
    this.setState({url});
  }
    
  updateBookmarkDescription(description) {
    this.setState({description});  
  }

  updateBookmarkRating(rating) {
    this.setState({rating});  
  }

  componentDidMount() {
    const { bookmarkId } = this.props.match.params
    console.log('BOOKMARK: ' + bookmarkId)
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${config.API_KEY}`
        }
      })
    .then(res => {
      if(!res.ok) {
        return res.json().then(error => {
          throw error
        })
      }
    return res.json()
    })
    .then(responseData => {
      console.log(responseData)
      this.setState({
        id: responseData.id,
        title: responseData.title,
        url: responseData.url, 
        description: responseData.description, 
        rating: responseData.rating
      });
          })
     
    .catch(error => {
      console.error(error)
      this.setState({ error });
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating: Number(rating) }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  /* state for inputs etc... */
  render() {
    const { error, title, url, description, rating } = this.state
    return (
      <section className='UpdateBookmarkForm'>
        <h2>UpdateBookmark</h2>
        <form onSubmit= {(e) => this.handleSubmit(e)}>
          <div className='UpdateBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input
            type='hidden'
            name='id'
          />
          <div>
            <label htmlFor='title'>
              Title
              <Required />
            </label>
            <input
              id='title'
              type='text'
              name='title'
              placeholder='Great article!'
              required
              value={title}
              onChange={this.updateBookmarkTitle}
          />
          </div>

          <div>
            <label htmlFor='url'>
              URL
              <Required />
            </label>
            <input
            id='url'
            type='url'
            name='url'
            placeholder='www.url.com'
            required
            value={url}
            onChange={e => this.updateBookmarkUrl(e.target.value)}
        />
          </div>

          <div>
            <label htmlFor='description'>
              Description
            </label>
            <input
            id='description'
            type='text'
            name='description'
            placeholder='Bookmark description!'
            value={description}
            onChange={e => this.updateBookmarkDescription(e.target.value)}
        />
          </div>

          <div>
            <label htmlFor='rating'>
              Rating
              <Required />
            </label>
            <input
            id='rating'
            type='number'
            name='rating'
            placeholder= '5'
            min='1'
            max='5'
            required
            value={rating}
            onChange={e => this.updateBookmarkRating(e.target.value)}
        />
          </div>
          
          <div className="update_button_group">
            <button type='button' onClick={() => this.props.history.push('/')}>
              Cancel
            </button>
           
            <button
              type="submit"
              className="save_button"
              >
                Save changes
            </button>
                </div>
        </form>
      </section>
    )
  }
}