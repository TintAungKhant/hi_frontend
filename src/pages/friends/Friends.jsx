import React from 'react'

function Friends() {
  return (
    <section className="container py-4">
    <div className="card mb-3">
      <div className="card__header">
        <h2>Pending</h2>
      </div>
      <div className="card__body">
        <ul className="list">
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Accept</button>
              <button className="btn btn--light-red">Reject</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Accept</button>
              <button className="btn btn--light-red">Reject</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="card mb-3">
      <div className="card__header">
        <h2>Online</h2>
      </div>
      <div className="card__body">
        <ul className="list">
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="online-badge">Online</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="online-badge">Online</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div className="card mb-3">
      <div className="card__header">
        <h2>Offline</h2>
      </div>
      <div className="card__body">
        <ul className="list">
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="offline-badge">Offline</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="offline-badge">Offline</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="offline-badge">Offline</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="offline-badge">Offline</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
          <li className="list__item">
            <div className="list__item__image">
              <img src="https://source.unsplash.com/500x500/?selfie" alt="Tom"/>
            </div>
            <div className="list__item__content">
              <div className="list__item__content__title">Your Name</div>
              <div className="list__item__content__text">
                <span className="offline-badge">Offline</span>
              </div>
            </div>
            <div className="list__item_action">
              <button className="btn btn--light-purple">Message</button>
              <button className="btn btn--light-red">Unfriend</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
  )
}

export default Friends
