import './style.css';

export default function LoadingAnimations() {
  return (
    <div className="col-3" style={{ height: `${window.innerHeight}px` }}>
      <div className="snippet" data-title="dot-falling">
        <div className="stage">
          <div className="dot-falling"></div>
        </div>
      </div>
    </div>
  );
};