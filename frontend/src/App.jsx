import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [earthWeight, setEarthWeight] = useState('');
  const [planetWeights, setPlanetWeights] = useState([]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/planet-weight/calculate', { earthWeight });
      setPlanetWeights(response.data);
    } catch (error) {
      console.error('Error calculating weights', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Gravitas: Planet Weight Calculator</h1>
        <form onSubmit={handleCalculate} className="space-y-4">
          <input
            type="number"
            value={earthWeight}
            onChange={(e) => setEarthWeight(e.target.value)}
            placeholder="Your weight on Earth (kg)"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Calculate Weights
          </button>
        </form>

        {planetWeights.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Your Weight on Other Planets:</h2>
            <ul>
              {planetWeights.map(({ planet, weight }) => (
                <li key={planet} className="flex justify-between border-b py-2">
                  <span>{planet}</span>
                  <span>{weight} kg</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
