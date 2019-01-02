import React from 'react'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import Img from 'react-image'

import copy from '../../js/data/copy.json'

const CardSource = ({ source, isLoading, onClickHandler }) => {
  function renderIconText(type) {
    switch(type) {
      case 'Eyewitness Testimony':
        return 'visibility'
      case 'Government Data':
        return 'public'
      case 'Satellite Imagery':
        return 'satellite'
      case 'Second-Hand Testimony':
        return 'visibility_off'
      case 'Video':
        return 'videocam'
      case 'Photo':
        return 'photo'
      case 'Photobook':
        return 'photo_album'
      default:
        return 'help'
    }
  }

  if (!source) {
    return (
      <div className="card-source">
        <div>Error: this source was not found</div>
      </div>
    )
  }

  let thumbnail = source.thumbnail
  if (!thumbnail || thumbnail === '') {
    // default to first image in paths, null if no images
    const imgs = source.paths.filter(p => p.match(/\.(jpg|png)$/))
    thumbnail = imgs.length > 0 ? imgs[0] : null
  }

  console.log(!!thumbnail)
  console.log(thumbnail)

  return (
    <div className="card-source">
      {isLoading
          ? <Spinner/>
          : (
            <div className="source-row" onClick={() => onClickHandler(source)}>
              {!!thumbnail ? (
                <img className="source-icon" src={thumbnail} width={30} height={30} />
              ) : (
                <i className="material-icons source-icon">
                  {renderIconText(source.type)}
                </i>
              )}
             <p>{source.id}</p>
            </div>
          )}
    </div>
  )
}

CardSource.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
}

export default CardSource
