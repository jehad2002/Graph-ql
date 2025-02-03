// export function createHome() {
//   const homeContainer = document.createElement("div");
//   homeContainer.classList.add("container", "main-container-pop");

//   homeContainer.innerHTML = `
//     <button id="logoutButton" class="btn btn-danger float-right">Disconnect</button>

//     <div class="home-box">
//       <h2>Welcome to the home page !</h2><br>
      
//       <div class="vertical-section" style="display: flex; justify-content: space-between;">
//         <div id="userProfile" class="user-profile inline-bordered-section">
//           <h5 id="userName">Name:</h5>
//           <h5 id="userEmail">Email: </h5>
//         </div>
        
//         <div id="levelCount" class="level-count inline-bordered-section">
          
//           <h5 id="userLevel">Level: </h5>
//         </div>
        
//         <div id="xpCount" class="xp-count inline-bordered-section">
//           <h3>DIV 01</h3>
//           <h5 id="userXP"> </h5>
//         </div>
//       </div>

//       <div class="vertical-section" style="display: flex; justify-content: space-between;">
//         <div id="statistics1" class="statistics-section inline-bordered-section">
//           <h3>XP name peer projet</h3>
//           <div id="chart1" class="chart-container">
//             <svg class="chart"></svg>
//           </div>
//         </div>
  
//         <div id="statistics2" class="statistics-section inline-bordered-section">
//           <h3>skills Technologies</h3>
//           <div id="chart2" class="chart-container">
//             <svg class="chart"></svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   `;

//   return homeContainer;
// }

//====================================================

export function createHome() {
  const homeContainer = document.createElement("div");
  homeContainer.classList.add("container", "main-container-pop");

  homeContainer.innerHTML = `
    <button id="logoutButton" class="btn btn-danger float-right">log out </button>

    <div class="home-box">
      <h2>Welcome to the home page !</h2><br>
      
      <div class="vertical-section" style="display: flex; justify-content: space-between;">
        <div id="userProfile" class="user-profile inline-bordered-section">
          <h5 id="userName">Name:</h5>
          <h5 id="userEmail">Email: </h5>
        </div>
        
        <div id="levelCount" class="level-count inline-bordered-section">
          <h5 id="userLevel">Level: </h5>
        </div>
        
        <div id="xpCount" class="xp-count inline-bordered-section">
          <h3>DIV 01</h3>
          <h5 id="userXP"> </h5>
        </div>
      </div>

<div class="vertical-section" style="display: flex; justify-content: space-between;">
  <div id="statistics1" class="statistics-section inline-bordered-section">
    <h3>XP name peer projet</h3>
    <div id="chart1" class="chart-container">
      <svg class="chart"></svg>
    </div>
  </div>

  <div id="statistics2" class="statistics-section inline-bordered-section">
    <h3>skills Technologies</h3>
    <div id="chart2" class="chart-container">
      <svg class="chart"></svg>
    </div>
  </div>
</div>

  `;

  return homeContainer;
}
