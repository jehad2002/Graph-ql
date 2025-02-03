import { logoutUser } from './app.js';
const jwt = localStorage.getItem('jwt');

export async function loadUserProfile() {
    const userProfileElement = document.getElementById('userProfile');

    if (userProfileElement && jwt) {
      try {
        const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                user {
                  lastName
                  firstName
                  email
                  attrs
                }
              }
            `,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error loading user profile:');
        }
  
        const { data } = await response.json();
        const user = data.user[0];
  
        document.getElementById('userName').textContent += `${user.firstName} ${user.lastName}`;
        document.getElementById('userEmail').textContent += user.email;
        

        
      } catch (error) {
        logoutUser()
        // console.error('Error loading user profile:', error.message);
      }
    }
  }
  
/****************************************************************************************************************************/
export async function loadXP() {
  if (jwt) {
    try {
      const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
           user{
            xps{
              path
              amount
            }
            }
            }

          `,
        }),
      });
      if (!response.ok) {
        throw new Error('Error loaded XP');
      }
      
      const { data } = await response.json();
      console.log("--- data:", data);
      // let arr = data.user[0].xps
      let arr = data.user[0].xps;

for (let i = 0; i < arr.length; i++) {
  let xp = arr[i];
  let path = xp.path;
  let amount = xp.amount;
  console.log(`XP Path: ${path}, Amount: ${amount}`);
}

      const totalXpAmount = data.xpTotal.aggregate.sum.amount;

      const totalXpAmountMB = totalXpAmount >= 1000 ? totalXpAmount / 1000 : totalXpAmount;
      const unit = totalXpAmount >= 1000 ? 'KB' : 'MB';

      const xpCountElement = document.getElementById('userXP');
      if (xpCountElement) {
        xpCountElement.textContent = `${totalXpAmountMB.toFixed(0)} ${unit}`;
      }
    } catch (error) {
    
      // console.error('Error loading XP :', error.message);
    }
  }
}

/****************************************************************************************************************************/

export async function loadLevel() {
    const levelCountElement = document.getElementById('userLevel');
  
    if (jwt) {
      try {
        const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                maxLevelTransaction: transaction_aggregate(
                  order_by: { amount: desc },
                  limit: 1
                ) {
                  nodes {
                    amount
                  }
                }
              }
            `,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error loading level');
        }
  
        const { data } = await response.json();
        const maxLevelAmount = data.maxLevelTransaction.nodes[0]?.amount;
  
        if (maxLevelAmount !== undefined) {
          levelCountElement.textContent = `Max Level xp project: ${maxLevelAmount}`;
        }
      } catch (error) {
        // console.error('Error loading level:', error.message);
      }
    }
  }
  
/****************************************************************************************************************************/

function convertToKB(xpAmount, decimalPlaces = 0) {
  const bytes = xpAmount;

  const kilobytes = bytes / 1000;

  const roundedKB = kilobytes.toFixed(decimalPlaces);

  const finalKB = Number(roundedKB).toString();

  return finalKB;
}

function barXpProjet(xpTransactions) {
  const xpByProject = {};

  xpTransactions.forEach(transaction => {
    const pathParts = transaction.path.split('/');
    const projectName = pathParts[pathParts.length - 1];
    xpByProject[projectName] = (xpByProject[projectName] || 0) + transaction.amount;
  });

  const sortedProjects = Object.keys(xpByProject).sort((a, b) => xpByProject[b] - xpByProject[a]);

  const topProjects = sortedProjects.slice(0, 10);

  const xpAmounts = topProjects.map(projectName => xpByProject[projectName]);

  const maxXP = Math.max(...xpAmounts);

  const colors = ['blue', 'green', 'red', 'purple', 'orange', 'yellow', 'brown', 'pink', 'gray', 'cyan'];

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '500'); 
  svg.setAttribute('height', '500'); 

  const barWidth = 30;

  for (let i = 0; i < topProjects.length; i++) {
    const projectName = topProjects[i];
    const xpAmount = xpByProject[projectName];
    const barHeight = (xpAmount / maxXP) * 200; 

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', i * (barWidth + 5)); 
    rect.setAttribute('y', 300 - barHeight); 
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', colors[i]); 

    rect.dataset.projectName = projectName;
    rect.dataset.xpAmount = xpAmount;

    rect.addEventListener('mouseenter', handleMouseEnter);
    rect.addEventListener('mouseleave', handleMouseLeave);

    svg.appendChild(rect); 
  }

  function handleMouseEnter(event) {
    const target = event.target;
    showTooltip(target);
  }

  function handleMouseLeave() {
    hideTooltip();
  }

  function showTooltip(bar) {
    const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltip.setAttribute('x', parseFloat(bar.getAttribute('x')) + barWidth / 2);
    tooltip.setAttribute('y', parseFloat(bar.getAttribute('y')) - 5);
    tooltip.setAttribute('text-anchor', 'right');
    tooltip.textContent = `${bar.dataset.projectName}\n: ${ convertToKB(bar.dataset.xpAmount)}kb`;

    svg.appendChild(tooltip);
  }

  function hideTooltip() {
    const tooltips = svg.querySelectorAll('text');
    tooltips.forEach(tooltip => svg.removeChild(tooltip));
  }

  return svg;
}


export async function loadXPAndDisplayChart() {
  if (jwt) {
    try {
      const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              xpTransactions: transaction(
                where: {
                  type: { _eq: "xp" },
                }
              ) {
                type
                amount
                path
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error('Error about XP');
      }

      const { data } = await response.json();

      const xpChartContainer = document.getElementById('chart1');
      if (xpChartContainer) {
        if (xpChartContainer.children.length > 0) {
          xpChartContainer.removeChild(xpChartContainer.children[0]);
        }

        const xpChart = barXpProjet(data.xpTransactions);

        xpChartContainer.appendChild(xpChart);
      }

    } catch (error) {
      // console.error('Error loading XP :', error.message);
    }
  }
}
/****************************************************************************************************************************/
async function fetchSkillTransactions(jwt) {
  try {
    const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            skillTransactions: transaction(
              where: {
                type: { _ilike: "%skill%" }
              }
            ) {
              type
              amount
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Error loading skills');
    }

    const { data } = await response.json();
    return data.skillTransactions;
  } catch (error) {
    // console.error('error2 :', error.message);
    throw error; 
  }
}

function createSkillChart(skillTransactions) {
  const svg = document.querySelector(".chart");
  const newWidth = 300;
  const newHeight = 300;

  const radius = Math.min(newWidth, newHeight) / 2;

  svg.setAttribute("width", newWidth);
  svg.setAttribute("height", newHeight);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(group);

  const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(legendGroup);

  const colors = ["red", "blue", "orange", "gray", "purple", "green", "#1abc9c"];

  const maxAmounts = {};

  skillTransactions.forEach(skill => {
    if (!maxAmounts[skill.type] || skill.amount > maxAmounts[skill.type]) {
      maxAmounts[skill.type] = skill.amount;
    }
  });

  const totalAmount = Object.values(maxAmounts).reduce((acc, val) => acc + val, 0);

  let startAngle = 0;

  const relevantSkills = ["skill_go", "skill_js", "skill_html", "skill_css", "skill_unix", "skill_docker", "skill_sql"];

  relevantSkills.forEach(skill => {
    const amount = maxAmounts[skill];
    const percentage = ((amount / totalAmount) * 100).toFixed(2);

    const endAngle = (amount / totalAmount) * 360 + startAngle;

    const startRadians = (startAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    const startX = radius * Math.cos(startRadians) + radius;
    const startY = radius * Math.sin(startRadians) + radius;
    const endX = radius * Math.cos(endRadians) + radius;
    const endY = radius * Math.sin(endRadians) + radius;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${radius} ${radius} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`);
    path.setAttribute("fill", colors[relevantSkills.indexOf(skill)]);

    // Add event listeners to show skill name on hover
    path.addEventListener('mouseenter', () => showSkillName(skill, percentage));
    path.addEventListener('mouseleave', hideSkillName);

    group.appendChild(path);

    startAngle = endAngle;
  });

  function showSkillName(skill, percentage) {
    const skillName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    skillName.setAttribute("x", newWidth / 2); // Center horizontally
    skillName.setAttribute("y", newHeight - 5); // Move it below the chart
    skillName.setAttribute("text-anchor", "middle");
    skillName.setAttribute("fill", "black");
    skillName.setAttribute("font-size", "20");
    skillName.textContent = `${skill}: ${percentage}%`;

    svg.appendChild(skillName);
  }

  function hideSkillName() {
    const skillNames = svg.querySelectorAll('text');
    skillNames.forEach(skillName => {
      if (skillName.getAttribute('font-size') === '20') {
        svg.removeChild(skillName);
      }
    });
  }

  return svg;
}

export async function loadSkills() {
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    try {
      const skillTransactions = await fetchSkillTransactions(jwt);

      const relevantSkills = ["skill_go", "skill_js", "skill_html", "skill_css", "skill_unix", "skill_docker", "skill_sql"];
      const filteredSkills = skillTransactions.filter(skill => relevantSkills.includes(skill.type));

      createSkillChart(filteredSkills);
    } catch (error) {
      // console.error('err :', error.message);
    }
  }
}

//=================================================

// import { logoutUser } from './app.js';
// const jwt = localStorage.getItem('jwt');

// export async function loadUserProfile() {
//     const userProfileElement = document.getElementById('userProfile');

//     if (userProfileElement && jwt) {
//       try {
//         const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${jwt}`,
//             'Content-type': 'application/json',
//           },
//           body: JSON.stringify({
//             query: `
//               query {
//                 user {
//                   lastName
//                   firstName
//                   email
//                   attrs
//                 }
//               }
//             `,
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Error loading user profile:');
//         }
  
//         const { data } = await response.json();
//         const user = data.user[0];
  
//         document.getElementById('userName').textContent += `${user.firstName} ${user.lastName}`;
//         document.getElementById('userEmail').textContent += user.email;

        
//       } catch (error) {
//         logoutUser()
//         // console.error('Error loading user profile:', error.message);
//       }
//     }
//   }
  
// /****************************************************************************************************************************/
// export async function loadXP() {
//   if (jwt) {
//     try {
//       const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${jwt}`,
//           'Content-type': 'application/json',
//         },
//         body: JSON.stringify({
//           query: `
//             query {
//            user{
//             xps{
//               path
//               amount
//             }
//             }
//             }

//           `,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Error loaded XP');
//       }
      
//       const { data } = await response.json();
//       console.log("--- data:", data);
//       // let arr = data.user[0].xps
//       let arr = data.user[0].xps;

// for (let i = 0; i < arr.length; i++) {
//   let xp = arr[i];
//   let path = xp.path;
//   let amount = xp.amount;
//   console.log(`XP Path: ${path}, Amount: ${amount}`);
// }

//       const totalXpAmount = data.xpTotal.aggregate.sum.amount;

//       const totalXpAmountMB = totalXpAmount >= 1000 ? totalXpAmount / 1000 : totalXpAmount;
//       const unit = totalXpAmount >= 1000 ? 'KB' : 'MB';

//       const xpCountElement = document.getElementById('userXP');
//       if (xpCountElement) {
//         xpCountElement.textContent = `${totalXpAmountMB.toFixed(0)} ${unit}`;
//       }
//     } catch (error) {
    
//       // console.error('Error loading XP :', error.message);
//     }
//   }
// }

// /****************************************************************************************************************************/

// export async function loadLevel() {
//     const levelCountElement = document.getElementById('userLevel');
  
//     if (jwt) {
//       try {
//         const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${jwt}`,
//             'Content-type': 'application/json',
//           },
//           body: JSON.stringify({
//             query: `
//               query {
//                 maxLevelTransaction: transaction_aggregate(
//                   order_by: { amount: desc },
//                   limit: 1
//                 ) {
//                   nodes {
//                     amount
//                   }
//                 }
//               }
//             `,
//           }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Error loading level');
//         }
  
//         const { data } = await response.json();
//         const maxLevelAmount = data.maxLevelTransaction.nodes[0]?.amount;
  
//         if (maxLevelAmount !== undefined) {
//           levelCountElement.textContent = `Max Level xp project: ${maxLevelAmount}`;
//         }
//       } catch (error) {
//         // console.error('Error loading level:', error.message);
//       }
//     }
//   }
  
// /****************************************************************************************************************************/

// function convertToKB(xpAmount, decimalPlaces = 0) {
//   const bytes = xpAmount;

//   const kilobytes = bytes / 1000;

//   const roundedKB = kilobytes.toFixed(decimalPlaces);

//   const finalKB = Number(roundedKB).toString();

//   return finalKB;
// }

// function barXpProjet(xpTransactions) {
//   const xpByProject = {};

//   xpTransactions.forEach(transaction => {
//     const pathParts = transaction.path.split('/');
//     const projectName = pathParts[pathParts.length - 1];
//     xpByProject[projectName] = (xpByProject[projectName] || 0) + transaction.amount;
//   });

//   const sortedProjects = Object.keys(xpByProject).sort((a, b) => xpByProject[b] - xpByProject[a]);

//   const topProjects = sortedProjects.slice(0, 10);

//   const xpAmounts = topProjects.map(projectName => xpByProject[projectName]);

//   const maxXP = Math.max(...xpAmounts);

//   const colors = ['#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41', '#b235dc41'];

//   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   svg.setAttribute('width', '500'); 
//   svg.setAttribute('height', '500'); 

//   const barWidth = 30;

//   for (let i = 0; i < topProjects.length; i++) {
//     const projectName = topProjects[i];
//     const xpAmount = xpByProject[projectName];
//     const barHeight = (xpAmount / maxXP) * 200; 

//     const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//     rect.setAttribute('x', i * (barWidth + 5)); 
//     rect.setAttribute('y', 300 - barHeight); 
//     rect.setAttribute('width', barWidth);
//     rect.setAttribute('height', barHeight);
//     rect.setAttribute('fill', colors[i]); 

//     rect.dataset.projectName = projectName;
//     rect.dataset.xpAmount = xpAmount;

//     rect.addEventListener('mouseenter', handleMouseEnter);
//     rect.addEventListener('mouseleave', handleMouseLeave);

//     svg.appendChild(rect); 
//   }

//   function handleMouseEnter(event) {
//     const target = event.target;
//     showTooltip(target);
//   }

//   function handleMouseLeave() {
//     hideTooltip();
//   }

//   function showTooltip(bar) {
//     const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//     tooltip.setAttribute('x', parseFloat(bar.getAttribute('x')) + barWidth / 2);
//     tooltip.setAttribute('y', parseFloat(bar.getAttribute('y')) - 5);
//     tooltip.setAttribute('text-anchor', 'right');
//     tooltip.textContent = `${bar.dataset.projectName}\n: ${ convertToKB(bar.dataset.xpAmount)}kb`;

//     svg.appendChild(tooltip);
//   }

//   function hideTooltip() {
//     const tooltips = svg.querySelectorAll('text');
//     tooltips.forEach(tooltip => svg.removeChild(tooltip));
//   }

//   return svg;
// }


// export async function loadXPAndDisplayChart() {
//   if (jwt) {
//     try {
//       const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${jwt}`,
//           'Content-type': 'application/json',
//         },
//         body: JSON.stringify({
//           query: `
//             query {
//               xpTransactions: transaction(
//                 where: {
//                   type: { _eq: "xp" },
//                 }
//               ) {
//                 type
//                 amount
//                 path
//               }
//             }
//           `,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Error about XP');
//       }

//       const { data } = await response.json();

//       const xpChartContainer = document.getElementById('chart1');
//       if (xpChartContainer) {
//         if (xpChartContainer.children.length > 0) {
//           xpChartContainer.removeChild(xpChartContainer.children[0]);
//         }

//         const xpChart = barXpProjet(data.xpTransactions);

//         xpChartContainer.appendChild(xpChart);
//       }

//     } catch (error) {
//       // console.error('Error loading XP :', error.message);
//     }
//   }
// }
// /****************************************************************************************************************************/
// async function fetchSkillTransactions(jwt) {
//   try {
//     const response = await fetch('https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${jwt}`,
//         'Content-type': 'application/json',
//       },
//       body: JSON.stringify({
//         query: `
//           query {
//             skillTransactions: transaction(
//               where: {
//                 type: { _ilike: "%skill%" }
//               }
//             ) {
//               type
//               amount
//             }
//           }
//         `,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Error loading skills');
//     }

//     const { data } = await response.json();
//     return data.skillTransactions;
//   } catch (error) {
//     // console.error('error2 :', error.message);
//     throw error; 
//   }
// }

// function createSkillChart(skillTransactions) {
//   const svg = document.querySelector(".chart");
//   const newWidth = 300;
//   const newHeight = 300;

//   const radius = Math.min(newWidth, newHeight) / 2;

//   svg.setAttribute("width", newWidth);
//   svg.setAttribute("height", newHeight);

//   const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
//   svg.appendChild(group);

//   const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
//   svg.appendChild(legendGroup);

//   const colors = ["red", "blue", "orange", "gray", "purple", "green", "#1abc9c"];

//   const maxAmounts = {};

//   skillTransactions.forEach(skill => {
//     if (!maxAmounts[skill.type] || skill.amount > maxAmounts[skill.type]) {
//       maxAmounts[skill.type] = skill.amount;
//     }
//   });

//   const totalAmount = Object.values(maxAmounts).reduce((acc, val) => acc + val, 0);

//   let startAngle = 0;

//   const relevantSkills = ["skill_go", "skill_js", "skill_html", "skill_css", "skill_unix", "skill_docker", "skill_sql"];

//   relevantSkills.forEach(skill => {
//     const amount = maxAmounts[skill];
//     const percentage = ((amount / totalAmount) * 100).toFixed(2);

//     const endAngle = (amount / totalAmount) * 360 + startAngle;

//     const startRadians = (startAngle * Math.PI) / 180;
//     const endRadians = (endAngle * Math.PI) / 180;

//     const startX = radius * Math.cos(startRadians) + radius;
//     const startY = radius * Math.sin(startRadians) + radius;
//     const endX = radius * Math.cos(endRadians) + radius;
//     const endY = radius * Math.sin(endRadians) + radius;

//     const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//     path.setAttribute("d", `M ${radius} ${radius} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`);
//     path.setAttribute("fill", colors[relevantSkills.indexOf(skill)]);

//     // Add event listeners to show skill name on hover
//     path.addEventListener('mouseenter', () => showSkillName(skill, percentage));
//     path.addEventListener('mouseleave', hideSkillName);

//     group.appendChild(path);

//     const textX = (startX + endX) / 2;
//     const textY = (startY + endY) / 2;

//     const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
//     text.setAttribute("x", textX);
//     text.setAttribute("y", textY);
//     text.setAttribute("text-anchor", "middle");
//     text.setAttribute("alignment-baseline", "middle");
//     text.textContent = `${percentage}%`;

//     group.appendChild(text);

//     const legendItem = document.createElementNS("http://www.w3.org/2000/svg", "text");
//     legendItem.setAttribute("x", newWidth - 30);
//     legendItem.setAttribute("y", startAngle + 20);
//     legendItem.setAttribute("text-anchor", "start");
//     legendItem.setAttribute("fill", colors[relevantSkills.indexOf(skill)]);
//     legendItem.textContent = `${skill} (${percentage}%)`;

//     // Add event listeners to show skill name on hover in the legend
//     legendItem.addEventListener('mouseenter', () => showSkillName(skill, percentage));
//     legendItem.addEventListener('mouseleave', hideSkillName);

//     legendGroup.appendChild(legendItem);

//     startAngle = endAngle;
//   });

//   function showSkillName(skill, percentage) {
//     const skillName = document.createElementNS("http://www.w3.org/2000/svg", "text");
//     skillName.setAttribute("x", newWidth / 2);
//     skillName.setAttribute("y", newHeight - 20);
//     skillName.setAttribute("text-anchor", "middle");
//     skillName.setAttribute("fill", "black");
//     skillName.setAttribute("font-size", "20");
//     skillName.textContent = `${skill}: ${percentage}%`;

//     svg.appendChild(skillName);
//   }

//   function hideSkillName() {
//     const skillNames = svg.querySelectorAll('text');
//     skillNames.forEach(skillName => {
//       if (skillName.getAttribute('font-size') === '20') {
//         svg.removeChild(skillName);
//       }
//     });
//   }

//   return svg;
// }

// export async function loadSkills() {
//   const jwt = localStorage.getItem('jwt');
//   if (jwt) {
//     try {
//       const skillTransactions = await fetchSkillTransactions(jwt);

//       const relevantSkills = ["skill_go", "skill_js", "skill_html", "skill_css", "skill_unix", "skill_docker", "skill_sql"];
//       const filteredSkills = skillTransactions.filter(skill => relevantSkills.includes(skill.type));

//       createSkillChart(filteredSkills);
//     } catch (error) {
//       // console.error('err :', error.message);
//     }
//   }
// }
