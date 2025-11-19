import React from 'react';

interface TaskDistributionChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({ data }) => {
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  
  return (
    <div className="simple-pie-chart">
      <h4>Task Distribution</h4>
      <div className="pie-chart">
        {data.labels.map((label, index) => (
          <div key={label} className="pie-segment">
            <div 
              className="segment-color"
              style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
            ></div>
            <span className="segment-label">
              {label}: {data.datasets[0].data[index]} ({Math.round((data.datasets[0].data[index] / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDistributionChart;