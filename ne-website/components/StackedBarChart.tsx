import React from 'react';

export interface StackedProgressBarSegment {
  color: string;
  percentage: number;
}

export const StackedProgressBar = ({ segments }: { segments: StackedProgressBarSegment[] }) => {
  const totalPercentage = segments.reduce((acc, segment) => acc + segment.percentage, 0);

  console.log("SPB:", segments);

  if (totalPercentage > 100) {
    console.error("Total percentage exceeds 100%");
  }

  return (
    <div style={styles.container}>
      {segments.map((segment, index) => (
        <div
          key={index}
          style={{
            ...styles.segment,
            backgroundColor: segment.color,
            width: `${segment.percentage}%`,
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '20px',
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
};
