import chefclaude_img from "/src/assets/images/chef-claude-icon.png";
import "./header.css";

function header() {
  return (
    <div className="header">
      <img src={chefclaude_img} alt="Chef Claude Logo" className="logo" />
      <h1>Chef Claude</h1>
    </div>
  );
}

export default header;
