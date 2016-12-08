import React, {PropTypes, Component} from 'react'
import axios from 'axios'
// State and imparative code are two of the things that makes building applications more difficult.
// The more components we can have that have no state and completely declarative the better.
// Doing this makes things easier to test and maintain.
//
// In this exercise, we're going to refactor the data-fetching example code to keep all the
// state and imparative code in one component, and all the UI rendering in a stateless,
// declarative function component.
//
// Example:
// 
// ```
// class FetchUserProfile extends Component {
//   state = {user: {}}
//   static propTypes = {
//     username: PropTypes.number.isRequired,
//     fetch: PropTypes.func,
//   }
//   static defaultProps = { fetch: axios.get } // doing this allows you to pass a mock version as a prop
//
//   componentDidMount() {
//     this.props.fetch(`/users/${this.props.username}`)
//       .then(
//         ({data: user}) => this.setState({user}),
//         // should add an error handler here :)
//       )
//   }
//
//   render() {
//     // doesn't have to be `children` prop. Can be anything.
//     return this.props.children(this.state)
//   }
// }
//
// function UserProfile({username, ...rest}) {
//   return (
//     <FetchUserProfile username={username} {...rest}>
//       {({user}) => (
//         <div>
//           <div>First name: {user.firstName}</div>
//           <div>Last name: {user.lastName}</div>
//           <div>Email address: {user.emailAddress}</div>
//         </div>
//       )}
//     </FetchUserProfile>
//   )
// }
//
// UserProfile.propTypes = {
//   username: PropTypes.number.isRequired
// }
// ```
//
// Ultimately, you can take this further to a generic Fetch component which can making
// subsequent requests on prop changes, caching, multiple requests in parallel, etc.
// Then you can write all your imparative tests around that generic Fetch component
// and the rest of your components can be much more declarative and more easily tested

class FetchRepoList extends Component {
  // put all the state related stuff in this component
  // and pass the state to the `children` render callback in `render`
  render() {
  }
}

// Refactor this to be a function component that uses <FetchRepoList>
class RepoListContainer extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    fetch: PropTypes.func,
  }
  static defaultProps = { fetch: axios.get }
  state = {repos: null, loading: false, error: null}

  componentDidMount() {
    this.fetchRepos()
  }

  fetchRepos() {
    this.setState({repos: null, loading: true, error: null})
    this.props.fetch(`https://api.github.com/users/${this.props.username}/repos?per_page=100&sort=pushed`)
      .then(
        ({data: repos}) => this.setState({repos, error: null, loading: false}),
        error => this.setState({repos: null, error, loading: false})
      )
  }

  render() {
    const {repos, loading, error} = this.state
    const {username} = this.props
    return (
      <div>
        {!loading ? null : <div>Loading...</div>}
        {!error ? null : (
          <div>
            Error loading info for <code>{username}</code>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
        {!repos ? null : <RepoList username={username} repos={repos} />}
      </div>
    )
  }
}

function RepoList({username, repos}) {
  return (
    <div>
      <h1>{username}'s repos</h1>
      <ul style={{textAlign: 'left'}}>
        {repos.map((repo) => {
          return <li key={repo.id}>{repo.name}</li>
        })}
      </ul>
    </div>
  )
}
RepoList.propTypes = {
  username: PropTypes.string.isRequired,
  repos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
}

export const example = () => (
  <RepoListContainer username="kentcdodds" fetch={mockFetch} />
)

// This is for you. Merry Christmas 🎅 🎄 🎁
function mockFetch() {
  const delay = 0 // set this to `Number.MAX_VALUE` test the loading state
  const sendError = false // set this to `true` to test out the error state
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (sendError) {
        reject({
          message: 'Something went wrong',
          status: 500,
        })
      } else {
        resolve({
          data: [
            {id: 12345, name: 'turbo-sniffle'},
            {id: 54321, name: 'ubiquitous-succotash'},
            {id: 43234, name: 'solid-waffle'},
          ]
        })
      }
    }, delay)
  })
}

export default RepoListContainer
