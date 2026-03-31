import { AppData } from '../types';

export const mockData: AppData = {
  currentUser: {
    id: "u1",
    name: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?u=a1"
  },
  users: [
    { id: "u1", name: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=a1" },
    { id: "u2", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=a2" },
    { id: "u3", name: "Marcus Johnson", avatar: "https://i.pravatar.cc/150?u=a3" }
  ],
  projects: [
    { id: "p1", name: "Website Redesign" },
    { id: "p2", name: "Q3 Marketing Campaign" }
  ],
  statuses: [
    { id: "s1", title: "To Do", order: 1 },
    { id: "s2", title: "In Progress", order: 2 },
    { id: "s3", title: "In Review", order: 3 },
    { id: "s4", title: "Done", order: 4 }
  ],
  tasks: [
    {
      id: "t101",
      projectId: "p1",
      title: "Design new landing page hero section",
      description: "Create high-fidelity mockups for the new hero section including the new primary CTA.",
      statusId: "s2",
      assigneeId: "u1",
      priority: "High",
      dueDate: "2026-04-05T00:00:00Z",
      tags: ["Design", "UI"],
      comments: [
        {
          id: "c1",
          userId: "u2",
          text: "Make sure to use the new brand guidelines for the button colors.",
          timestamp: "2026-03-30T14:22:00Z"
        }
      ]
    },
    {
      id: "t102",
      projectId: "p1",
      title: "Update navigation menu links",
      description: "Remove deprecated links and add the new 'Solutions' dropdown.",
      statusId: "s1",
      assigneeId: "u3",
      priority: "Medium",
      dueDate: "2026-04-10T00:00:00Z",
      tags: ["Frontend"],
      comments: []
    },
    {
      id: "t104",
      projectId: "p1",
      title: "Audit current site performance",
      description: "Run Lighthouse reports and identify bottlenecks in page load times.",
      statusId: "s3",
      assigneeId: "u1",
      priority: "High",
      dueDate: "2026-04-02T00:00:00Z",
      tags: ["Performance", "SEO"],
      comments: []
    },
    {
      id: "t105",
      projectId: "p1",
      title: "Implement mobile responsiveness",
      description: "Ensure all new components work seamlessly on mobile and tablet devices.",
      statusId: "s2",
      assigneeId: "u3",
      priority: "High",
      dueDate: "2026-04-08T00:00:00Z",
      tags: ["Frontend", "Mobile"],
      comments: []
    },
    {
      id: "t106",
      projectId: "p1",
      title: "Optimize image assets",
      description: "Convert all large images to WebP format and implement lazy loading.",
      statusId: "s1",
      assigneeId: "u2",
      priority: "Medium",
      dueDate: "2026-04-12T00:00:00Z",
      tags: ["Performance"],
      comments: []
    },
    {
      id: "t107",
      projectId: "p1",
      title: "Setup Google Analytics 4",
      description: "Configure tracking for custom events and user journeys.",
      statusId: "s1",
      assigneeId: "u1",
      priority: "Medium",
      dueDate: "2026-04-15T00:00:00Z",
      tags: ["Analytics"],
      comments: []
    },
    {
      id: "t108",
      projectId: "p1",
      title: "Write copy for About Us page",
      description: "Draft the new company narrative and team bios.",
      statusId: "s2",
      assigneeId: "u2",
      priority: "Low",
      dueDate: "2026-04-07T00:00:00Z",
      tags: ["Content"],
      comments: []
    },
    {
      id: "t109",
      projectId: "p1",
      title: "Fix footer alignment issues",
      description: "Correct the spacing and alignment in the footer across different viewports.",
      statusId: "s4",
      assigneeId: "u3",
      priority: "Low",
      dueDate: "2026-03-28T00:00:00Z",
      tags: ["Frontend", "Bug"],
      comments: []
    },
    {
      id: "t110",
      projectId: "p1",
      title: "Create new icon set",
      description: "Design a custom set of icons for the features section.",
      statusId: "s1",
      assigneeId: "u1",
      priority: "Medium",
      dueDate: "2026-04-20T00:00:00Z",
      tags: ["Design"],
      comments: []
    },
    {
      id: "t103",
      projectId: "p2",
      title: "Draft email newsletter copy",
      description: "Write the initial draft for the April product update newsletter.",
      statusId: "s4",
      assigneeId: "u2",
      priority: "Low",
      dueDate: "2026-03-25T00:00:00Z",
      tags: ["Content"],
      comments: []
    },
    {
      id: "t201",
      projectId: "p2",
      title: "Social media graphics for launch",
      description: "Design a set of 10 graphics for Instagram and Twitter to promote the Q3 launch.",
      statusId: "s2",
      assigneeId: "u1",
      priority: "High",
      dueDate: "2026-04-15T00:00:00Z",
      tags: ["Design", "Social"],
      comments: []
    },
    {
      id: "t202",
      projectId: "p2",
      title: "Coordinate with PR agency",
      description: "Schedule a briefing call with the PR team to discuss the campaign timeline.",
      statusId: "s1",
      assigneeId: "u2",
      priority: "Medium",
      dueDate: "2026-04-05T00:00:00Z",
      tags: ["Marketing"],
      comments: []
    },
    {
      id: "t203",
      projectId: "p2",
      title: "Finalize campaign budget",
      description: "Review and approve the final budget allocation for paid advertisements.",
      statusId: "s3",
      assigneeId: "u3",
      priority: "High",
      dueDate: "2026-04-10T00:00:00Z",
      tags: ["Finance"],
      comments: []
    }
  ]
};
