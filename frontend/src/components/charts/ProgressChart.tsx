import React from 'react';

interface ProgressChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="simple-chart">
      <h4>Task Progress</h4>
      <div className="chart-bars">
        {data.labels.map((label, index) => (
          <div key={label} className="chart-bar">
            <div className="bar-label">{label}</div>
            <div className="bar-container">
              <div 
                className="bar created" 
                style={{ width: `${(data.datasets[0].data[index] / 20) * 100}%` }}
              >
                <span>{data.datasets[0].data[index]} created</span>
              </div>
              <div 
                className="bar completed" 
                style={{ width: `${(data.datasets[1].data[index] / 20) * 100}%` }}
              >
                <span>{data.datasets[1].data[index]} completed</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;