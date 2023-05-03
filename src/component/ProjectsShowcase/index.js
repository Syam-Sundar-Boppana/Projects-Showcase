import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.fetchData()
  }

  onChangeSelect = event => {
    this.setState({activeCategory: event.target.value}, this.fetchData)
  }

  fetchData = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" width={50} height={50} color="#328af2" />
    </div>
  )

  renderSuccess = () => {
    const {projectsList} = this.state
    return (
      <ul className="list-container">
        {projectsList.map(each => (
          <li className="list-item" key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailure = () => (
    <div className="fail-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-title">Oops! Something Went Wrong</h1>
      <p className="fail-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry" type="button" onClick={this.fetchData}>
        Retry
      </button>
    </div>
  )

  renderOutput = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state
    return (
      <div>
        <div className="navbar">
          <img
            className="image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="bottom-container">
          <select
            className="select"
            value={activeCategory}
            onChange={this.onChangeSelect}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          <div>{this.renderOutput()}</div>
        </div>
      </div>
    )
  }
}

export default ProjectsShowcase
