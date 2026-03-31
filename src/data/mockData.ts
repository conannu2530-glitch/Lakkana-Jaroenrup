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
    }
  ]
};
