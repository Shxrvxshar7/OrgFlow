import { createServer, Model } from 'miragejs';

const employeeData = [
  {
    id: '1',
    name: 'Mark Hill',
    designation: 'Chief Executive Officer (CEO)',
    team: 'Leadership',
    manager: null,
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg'
  },
  {
    id: '2',
    name: 'Joe Linux',
    designation: 'Chief Technology Officer (CTO)',
    team: 'Technology',
    manager: '1',
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg'
  },
  {
    id: '3',
    name: 'Linda May',
    designation: 'Chief Business Officer (CBO)',
    team: 'Business',
    manager: '1',
    gender: 'female',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/female/1.jpg'
  },
  {
    id: '4',
    name: 'John Green',
    designation: 'Chief Accounting Officer (CAO)',
    team: 'Finance',
    manager: '1',
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg'
  },
  {
    id: '5',
    name: 'Ron Blomquist',
    designation: 'Chief Information Security Officer (CISO)',
    team: 'Technology',
    manager: '2',
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/4.jpg'
  },
  {
    id: '6',
    name: 'Michael Rubin',
    designation: 'Chief Innovation Officer (CIO)',
    team: 'Technology',
    manager: '2',
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg'
  },
  {
    id: '7',
    name: 'Alice Lopez',
    designation: 'Chief Communications Officer (CCO)',
    team: 'Business',
    manager: '3',
    gender: 'female',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg'
  },
  {
    id: '8',
    name: 'Mary Johnson',
    designation: 'Chief Brand Officer (CBO)',
    team: 'Business',
    manager: '3',
    gender: 'female',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/female/3.jpg'
  },
  {
    id: '9',
    name: 'Kirk Douglas',
    designation: 'Chief Business Development Officer (CBDO)',
    team: 'Business',
    manager: '3',
    gender: 'male',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/male/6.jpg'
  },
  {
    id: '10',
    name: 'Erica Reel',
    designation: 'Chief Customer Officer (CCO)',
    team: 'Business',
    manager: '3',
    gender: 'female',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg'
  },
  {
    id: '11',
    name: 'Sarah Wilson',
    designation: 'Financial Analyst',
    team: 'Finance',
    manager: '4',
    gender: 'female',
    profileUrl: 'https://xsgames.co/randomusers/assets/avatars/female/5.jpg'
  }
];

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      employee: Model,
    },

    seeds(server) {
      employeeData.forEach(employee => {
        server.create("employee", employee);
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/employees", (schema) => {
        return { employees: schema.employees.all().models };
      });

      this.patch("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);

        const employee = schema.employees.find(id);
        if (!employee) {
          return new Response(404, {}, { error: "Employee not found" });
        }

        // Validate manager change
        if (attrs.manager) {
          const newManager = schema.employees.find(attrs.manager);
          
          // Check if manager exists
          if (!newManager) {
            return new Response(400, {}, { error: "Manager not found" });
          }
          
          // Check if employee is CEO
          if (employee.designation.toLowerCase().includes('ceo')) {
            return new Response(400, {}, { error: "Cannot change CEO's manager" });
          }
          
          // Check for self-assignment
          if (id === attrs.manager) {
            return new Response(400, {}, { error: "Cannot assign employee as their own manager" });
          }

          // Update employee's team to match new manager's team
          employee.update({
            manager: attrs.manager,
            team: newManager.team
          });

          return employee;
        }

        return new Response(400, {}, { error: "Invalid update request" });
      });
    },
  });

  return server;
}
