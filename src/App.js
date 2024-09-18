// src/App.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun, faCloud, faCloudShowersHeavy, faSnowflake, faBolt, faCloudSun, faSmog, faWind, faTornado
} from '@fortawesome/free-solid-svg-icons';
import './App.css'; // Import the CSS file

const iconMap = {
  "Clear": faSun,
  "Cloudy": faCloud,
  "Rain": faCloudShowersHeavy,
  "Snow": faSnowflake,
  "Thunderstorm": faBolt,
  "Partly Cloudy": faCloudSun,
  "Mostly Cloudy": faCloudSun,
  "Fog": faSmog,
  "Windy": faWind,
  "Showers": faCloudShowersHeavy,
  "Sleet": faSnowflake,
  "Hail": faCloudShowersHeavy,
  "Tornado": faTornado,
  "Hazy": faSmog,
  // Add more conditions as needed
};

function App() {
  const [city, setCity] = useState('Toronto');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchWeatherData = async (selectedCity) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://yahoo-weather5.p.rapidapi.com/weather?location=${selectedCity}&format=json&u=c`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'ce40ac7c74msh1b6e3fb18fc1348p10e6dfjsnfef56b2c29ea', // Ensure to replace with your actual API key
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data. Response status: ' + response.status);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again later.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="weather-container">
      <h1 className="text-center mb-4">Canada Now</h1>

      <div className="form-container">
        <Form>
          <Form.Group controlId="citySelect">
            <Form.Label>Select a City</Form.Label>
            <Form.Control 
              as="select" 
              value={city} 
              onChange={handleCityChange} 
              style={{ width: '200px' }} // Adjust width as needed
            >
              <option value="Toronto">Toronto</option>
              <option value="Vancouver">Vancouver</option>
              <option value="Montreal">Montreal</option>
              <option value="Calgary">Calgary</option>
              <option value="Ottawa">Ottawa</option>
              <option value="Edmonton">Edmonton</option>
              <option value="Winnipeg">Winnipeg</option>
              <option value="Halifax">Halifax</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={() => fetchWeatherData(city)} className="mt-3">
            Refresh
          </Button>
        </Form>
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-danger">{error}</p>}

      {weatherData && !loading && (
        <Card className="weather-card text-center mt-4 cloud-card">
          <Card.Body className="weather-card-body">
            <Card.Title className="weather-title">
              <FontAwesomeIcon icon={iconMap[weatherData.current_observation.condition.text] || faSun} />
              {weatherData.current_observation.condition.temperature}°C
            </Card.Title>
            <Card.Text>
              <strong>{weatherData.current_observation.condition.text}</strong>
            </Card.Text>
            <Card.Text>
              <strong>High:</strong> {weatherData.forecasts[0].high}°C
              <br />
              <strong>Low:</strong> {weatherData.forecasts[0].low}°C
            </Card.Text>
            <Card.Text>
              <strong>Humidity:</strong> {weatherData.current_observation.atmosphere.humidity}%
            </Card.Text>
            <h3>4-Day Forecast</h3>
            <Row>
              {weatherData.forecasts.slice(1, 5).map((forecast, index) => (
                <Col key={index} xs={12} md={6} lg={3} className="mb-4">
                  <Card className="forecast-card">
                    <Card.Body>
                      <Card.Title>{forecast.day}</Card.Title>
                      <Card.Text>
                        <strong>High:</strong> {forecast.high}°C
                        <br />
                        <strong>Low:</strong> {forecast.low}°C
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      <footer className="footer">
        <div className="clock">
          {hours}:{minutes}:{seconds}
        </div>
      </footer>
    </div>
  );
}

export default App;
