import React, { Component } from 'react';
import { MultiSelect } from "react-multi-select-component";
import { jwtDecode } from 'jwt-decode';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postType: '1',
            selectedExercise: '',
            customExercise: '',
            textContent: '',
            selectedMuscleGroups: [],
            timeHours: '',
            timeMinutes: '',
            distance: '',
            distanceUnit: 'miles',
            showAlert: false,
            alertMessage: '',
            alertType: 'success',
        };
    }

    handleExerciseChange = (event) => {
        this.setState({ selectedExercise: event.target.value });
    };

    handleMuscleGroupChange = (selectedOptions) => {
        
        this.setState({ selectedMuscleGroups: selectedOptions || [] });
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleTabClick = (postType) => {
        this.setState({ postType });
    };


    handleSubmitPost = (event) => {
        event.preventDefault();

        const { postType, customExercise, selectedExercise, selectedMuscleGroups, timeHours, timeMinutes, distance, distanceUnit, textContent } = this.state;
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

        // Create current date-time string in ISO format
        const createdAt = new Date().toISOString();

        // Prepare content based on post type
        let content = '';
        if (postType === '1') {
            content = textContent;
        } else if (postType === '2') {
            if (selectedExercise === 'lifting') {
                const muscleGroupsString = selectedMuscleGroups.map(group => group.label).join(', ');
                content = `Logged a lifting workout: ${muscleGroupsString} for ${timeHours} hr(s)`;
            }
            else {
                content = customExercise
                    ? `Logged an exercise: ${customExercise} for ${timeHours} hours and ${timeMinutes} minutes`
                    : `Logged an exercise: ${selectedExercise}: ${distance} ${distanceUnit} in ${timeHours} hours and ${timeMinutes} minutes.`;
            }
            
        }

        // Construct the postData object
        const postData = {
            userName: username,
            content,
            type: parseInt(postType), // Ensure type is an integer
            createdAt,
            accomplishmentDetails: '' // Provide default or appropriate value
        };

        // Make the POST request
        fetch('https://localhost:7263/Post', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                this.showAlert("Post created successfully!");
            })
            .catch(error => {
                console.error('Error:', error);
                this.showAlert("Error in submitting post");
            });
    };


    showAlert = (message, type = 'success') => {
        this.setState({ showAlert: true, alertMessage: message, alertType: type });
        setTimeout(() => this.setState({ showAlert: false }), 3000); // Hide alert after 3 seconds
    };

    render() {
        const {
            postType,
            selectedExercise,
            customExercise,
            selectedMuscleGroups,
            timeHours,
            timeMinutes,
            distance,
            textContent,
            distanceUnit,
            showAlert,
            alertMessage,
            alertType,
        } = this.state;

        const muscleGroupOptions = [
            { value: 0, label: 'Biceps' },
            { value: 1, label: 'Triceps' },
            { value: 2, label: 'Chest' },
            { value: 3, label: 'Back' },
            { value: 4, label: 'Legs' }, 
        ];
        return (
            <div className="border border-black rounded" style={{ maxWidth: '600px', backgroundColor: '#7FA1C3' }}>
                
                <ul className="nav nav-tabs" id="postTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            onClick={() => this.handleTabClick('1')}
                            className={`nav-link ${postType === '1' ? 'active custom-tab-active' : 'custom-tab'}`}
                            id="text-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#text"
                            type="button"
                            role="tab"
                            aria-controls="text"
                            aria-selected={postType === '1'}

                        >
                            Text Post
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            onClick={() => this.handleTabClick('2')}
                            className={`nav-link ${postType === '2' ? 'active custom-tab-active' : 'custom-tab'}`}
                            id="exercise-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#exercise"
                            type="button"
                            role="tab"
                            aria-controls="exercise"
                            aria-selected={postType === '2'}
                        >
                            Exercise
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="postTabContent">
                    <div
                        className="tab-pane fade show active"
                        id="text"
                        role="tabpanel"
                        aria-labelledby="text-tab"
                    >
                        <textarea style={{ resize: 'none' }}
                            className="form-control "
                            placeholder="Write your text post here..."
                            value={textContent}
                            name="textContent"
                            onChange={this.handleInputChange}
                        ></textarea>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="exercise"
                        role="tabpanel"
                        aria-labelledby="accomplishment-tab"
                    >
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="exerciseSelect">
                                Exercise
                            </label>
                            <select
                                className="form-select"
                                id="exerciseSelect"
                                onChange={this.handleExerciseChange}
                                value={selectedExercise}
                            >
                                <option value="">Choose a workout...</option>
                                <option value="run">Run</option>
                                <option value="lifting">Lifting</option>
                                <option value="bike">Bike Ride</option>
                                <option value="other">Other Exercise</option>
                            </select>
                        </div> { /* Select exercise dropdown*/ }

                        {selectedExercise === 'run' || selectedExercise === 'bike' ? (
                            <div className="mb-3">
                                <label className="form-label">Time and Distance</label>
                                <input
                                    type="number"
                                    name="timeHours"
                                    value={timeHours}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    placeholder="Hours"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    name="timeMinutes"
                                    value={timeMinutes}
                                    onChange={this.handleInputChange}
                                    className="form-control mt-2"
                                    placeholder="Minutes"
                                    min="0"
                                />
                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="distance"
                                        value={distance}
                                        onChange={this.handleInputChange}
                                        className="form-control mt-2"
                                        placeholder="Distance"
                                        min="0.01"
                                    />
                                    <select
                                        className="form-select mt-2"
                                        onChange={this.handleInputChange}
                                        name="distanceUnit"
                                        value={distanceUnit}
                                    >
                                        <option value="miles">Miles</option>
                                        <option value="kilometers">Kilometers</option>
                                        </select>
                                </div>
                            </div>
                        ) : selectedExercise === 'other' ? (
                            <div className="mb-3">
                                <label className="form-label">Exercise name and time</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="customExercise"
                                        value={customExercise}
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Workout type"
                                    />
                                    <input
                                        type="number"
                                        name="timeHours"
                                        value={timeHours}
                                        onChange={this.handleInputChange}
                                        className="form-control ms-2"
                                        placeholder="(Optional) Time (e.g., 1.5)..."
                                        min="0"
                                    />
                                </div>
                            </div>
                        ) : selectedExercise === 'lifting' ? (
                            <div className="mb-3">
                                <label className="form-label">Muscle Group and Time</label>
                                <MultiSelect
                                    options={muscleGroupOptions}
                                    value={selectedMuscleGroups}
                                    onChange={this.handleMuscleGroupChange}
                                    labelledBy="Select"
                                />
                                <input
                                    type="number"
                                    name="timeHours"
                                    value={timeHours}
                                    onChange={this.handleInputChange}
                                    className="form-control mt-3"
                                    placeholder="(Optional) Time Hours (e.g., 1.5)..."
                                    min="0"
                                />
                            </div>
                        
                            )  : null}

                    </div>
                </div>
                <button type="submit" onClick={this.handleSubmitPost} className="btn btn-primary btn-sm">Submit Post</button>
                {showAlert && (
                    <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                        {alertMessage}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
            </div>
        );
    }
}

export default CreatePost;

