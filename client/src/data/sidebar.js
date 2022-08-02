export default function() {
  return [
    {
      title: "Project Dashboard",
      to: "/project-overview",
      htmlBefore: '<i class="material-icons">lightbulb</i>',
      htmlAfter: ""
    },
    {
      title: "My Projects",
      htmlBefore: '<i class="material-icons">contacts</i>',
      to: "/my-projects",
    },
    {
      title: "Create Project",
      htmlBefore: '<i class="material-icons">add_task</i>',
      to: "/create-project",
    },
    {
      title: "Transactions",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/transactions",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile",
    },
  ];
}
