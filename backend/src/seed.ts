import { connect, connection, Types } from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-dashboard';

async function seed() {
  console.log('Connecting to MongoDB…');
  await connect(MONGO_URI);
  console.log('Connected.');

  const db = connection.db!;

  // Clear existing data
  const collections = ['employees', 'timelineevents', 'feedbackimports', 'aisuggestions'];
  for (const name of collections) {
    try { await db.collection(name).drop(); } catch { /* collection may not exist */ }
  }

  // ── Employees ──────────────────────────────────────────────────────
  const emp1Id = new Types.ObjectId();
  const emp2Id = new Types.ObjectId();
  const emp3Id = new Types.ObjectId();

  const employees = [
    {
      _id: emp1Id,
      email: 'aarav.mehta@jtg.example',
      name: 'Aarav Mehta',
      designation: 'Software Engineer',
      currentProject: 'Claims Modernization',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
      pastProjects: ['Agent Portal'],
      achievements: [
        'Reduced claims dashboard load time by 38%',
        'Created onboarding notes for three new engineers',
        'Owned migration of shared form components to TypeScript',
      ],
      strengths: ['Ownership', 'Frontend architecture', 'Cross-team communication'],
      improvementAreas: ['Mentor juniors more consistently', 'Document API decisions earlier'],
      weaknesses: ['Deep cloud infrastructure exposure', 'Advanced system design'],
      managerNotes: 'Ready for larger module ownership if paired with a senior reviewer for design reviews.',
      certifications: ['AWS Cloud Practitioner', 'React Advanced Patterns Workshop'],
      domainExperience: ['Insurance', 'Claims', 'Internal Platforms'],
      inductionDate: new Date('2024-03-04'),
      role: 'employee',
      visibilitySettings: {
        pastProjects: 'public',
        achievements: 'public',
        strengths: 'public',
        timelineDetails: 'shared',
        certifications: 'public',
        domainExperience: 'public',
        feedbackSummary: 'shared',
      },
      profileCompleteness: 82,
    },
    {
      _id: emp2Id,
      email: 'nisha.rao@jtg.example',
      name: 'Nisha Rao',
      designation: 'Engineering Manager',
      currentProject: 'Platform Enablement',
      skills: ['People Management', 'Delivery', 'React', 'Node.js', 'Architecture'],
      pastProjects: [],
      achievements: ['Improved onboarding playbook adoption across two teams', 'Reduced cross-team dependency delays'],
      strengths: ['Coaching', 'Planning', 'Delivery governance'],
      improvementAreas: ['Delegate operational tracking to team champions'],
      weaknesses: ['Hands-on depth in newer frontend tooling'],
      managerNotes: 'Can view team analytics as a manager role in the prototype.',
      certifications: ['Certified ScrumMaster'],
      domainExperience: ['FinTech', 'Internal Platforms'],
      inductionDate: new Date('2024-08-05'),
      role: 'champion',
      visibilitySettings: {
        pastProjects: 'public',
        achievements: 'public',
        strengths: 'public',
        timelineDetails: 'shared',
        certifications: 'public',
        domainExperience: 'public',
        feedbackSummary: 'public',
      },
      profileCompleteness: 75,
    },
    {
      _id: emp3Id,
      email: 'kabir.singh@jtg.example',
      name: 'Kabir Singh',
      designation: 'Senior QA Engineer',
      currentProject: 'Claims Modernization',
      skills: ['Automation', 'Playwright', 'API Testing', 'Performance Testing'],
      pastProjects: [],
      achievements: ['Built smoke automation for claims release train', 'Reduced regression cycle by two days'],
      strengths: ['Automation strategy', 'Release discipline'],
      improvementAreas: ['Increase mentoring visibility'],
      weaknesses: ['Frontend implementation depth'],
      managerNotes: '',
      certifications: ['ISTQB Advanced'],
      domainExperience: ['Insurance', 'Claims'],
      inductionDate: new Date('2024-06-10'),
      role: 'employee',
      visibilitySettings: {
        pastProjects: 'public',
        achievements: 'public',
        strengths: 'public',
        timelineDetails: 'shared',
        certifications: 'public',
        domainExperience: 'public',
        feedbackSummary: 'shared',
      },
      profileCompleteness: 60,
    },
  ];

  await db.collection('employees').insertMany(employees);
  console.log(`Inserted ${employees.length} employees.`);

  // ── Timeline events ────────────────────────────────────────────────
  const timelineEvents = [
    { employeeId: emp1Id, type: 'joining', title: 'Joined JTG induction', description: 'Completed engineering onboarding, security training, and platform overview.', date: new Date('2024-03-04'), metadata: {} },
    { employeeId: emp1Id, type: 'project_assignment', title: 'Assigned to Agent Portal', description: 'Started as full-stack developer for policy search workflows.', date: new Date('2024-03-18'), metadata: {} },
    { employeeId: emp1Id, type: 'rampup_milestone', title: 'Ramp-up completed', description: 'Closed initial access gaps and shipped first independent feature.', date: new Date('2024-05-03'), metadata: {} },
    { employeeId: emp1Id, type: 'project_assignment', title: 'Moved to Claims Modernization', description: 'Transitioned to frontend ownership for claim intake experience.', date: new Date('2025-01-13'), metadata: {} },
    { employeeId: emp1Id, type: 'feedback_import', title: 'Quarterly feedback imported', description: 'Latest feedback highlighted ownership and frontend architecture strengths.', date: new Date('2026-04-18'), metadata: {} },
    { employeeId: emp2Id, type: 'project_assignment', title: 'Started Platform Enablement', description: 'Moved into manager role for internal platform teams.', date: new Date('2024-08-05'), metadata: {} },
  ];

  await db.collection('timelineevents').insertMany(timelineEvents);
  console.log(`Inserted ${timelineEvents.length} timeline events.`);

  // ── Feedback imports ───────────────────────────────────────────────
  const feedbackImports = [
    {
      employeeId: emp1Id,
      importedAt: new Date('2026-04-18'),
      label: 'Q2 2026 Feedback Cycle',
      isLatest: true,
      analyticsData: {
        categoryScores: [
          { category: 'Technical', score: 86 },
          { category: 'Ownership', score: 91 },
          { category: 'Communication', score: 82 },
          { category: 'Collaboration', score: 85 },
          { category: 'Planning', score: 76 },
        ],
        feedbackTrend: [
          { period: 'Q2 25', score: 72 },
          { period: 'Q3 25', score: 76 },
          { period: 'Q4 25', score: 80 },
          { period: 'Q2 26', score: 86 },
        ],
        skillRatings: [],
        strengths: ['Takes end-to-end ownership', 'Keeps UI quality high', 'Communicates blockers early'],
        improvementAreas: ['Increase system design depth', 'Delegate and mentor more', 'Add more written design notes'],
        radarData: [
          { axis: 'Technical', value: 86 },
          { axis: 'Ownership', value: 91 },
          { axis: 'Communication', value: 82 },
          { axis: 'Collaboration', value: 85 },
          { axis: 'Planning', value: 76 },
        ],
        rawData: {
          overallScore: 84,
          sentiment: 'positive',
          summary: 'Strong execution and ownership. The next growth step is broader design participation and mentoring.',
          previousScores: { Technical: 80, Ownership: 84, Communication: 76, Collaboration: 83, Planning: 72 },
          benchmarks: { Technical: 78, Ownership: 80, Communication: 77, Collaboration: 79, Planning: 75 },
          trends: [
            { cycle: 'Q2 25', technical: 72, ownership: 74, communication: 69, collaboration: 76 },
            { cycle: 'Q3 25', technical: 76, ownership: 80, communication: 72, collaboration: 79 },
            { cycle: 'Q4 25', technical: 80, ownership: 84, communication: 76, collaboration: 83 },
            { cycle: 'Q2 26', technical: 86, ownership: 91, communication: 82, collaboration: 85 },
          ],
        },
      },
    },
    {
      employeeId: emp1Id,
      importedAt: new Date('2025-12-12'),
      label: 'Q4 2025 Feedback Cycle',
      isLatest: false,
      analyticsData: {
        categoryScores: [
          { category: 'Technical', score: 80 },
          { category: 'Ownership', score: 84 },
          { category: 'Communication', score: 76 },
          { category: 'Collaboration', score: 83 },
          { category: 'Planning', score: 72 },
        ],
        feedbackTrend: [
          { period: 'Q2 25', score: 72 },
          { period: 'Q3 25', score: 76 },
          { period: 'Q4 25', score: 80 },
        ],
        skillRatings: [],
        strengths: ['Dependable delivery', 'Good collaboration'],
        improvementAreas: ['Earlier technical design documentation'],
        radarData: [
          { axis: 'Technical', value: 80 },
          { axis: 'Ownership', value: 84 },
          { axis: 'Communication', value: 76 },
          { axis: 'Collaboration', value: 83 },
          { axis: 'Planning', value: 72 },
        ],
        rawData: {
          overallScore: 79,
          sentiment: 'positive',
          summary: 'Reliable delivery with clear progress in ownership and collaboration.',
          previousScores: { Technical: 76, Ownership: 80, Communication: 72, Collaboration: 79, Planning: 70 },
          benchmarks: { Technical: 76, Ownership: 78, Communication: 75, Collaboration: 78, Planning: 74 },
          trends: [
            { cycle: 'Q2 25', technical: 72, ownership: 74, communication: 69, collaboration: 76 },
            { cycle: 'Q3 25', technical: 76, ownership: 80, communication: 72, collaboration: 79 },
            { cycle: 'Q4 25', technical: 80, ownership: 84, communication: 76, collaboration: 83 },
          ],
        },
      },
    },
  ];

  await db.collection('feedbackimports').insertMany(feedbackImports);
  console.log(`Inserted ${feedbackImports.length} feedback imports.`);

  // ── AI Suggestions ─────────────────────────────────────────────────
  const aiSuggestions = [
    {
      employeeId: emp1Id,
      generatedAt: new Date(),
      targetDesignation: 'Senior Software Engineer',
      suggestedGoals: [
        'Lead a medium-complexity module design',
        'Mentor one engineer through a feature delivery',
        'Build cloud deployment fluency',
      ],
      skillGaps: [
        { skill: 'System Design', currentLevel: 'Intermediate', requiredLevel: 'Advanced' },
        { skill: 'Cloud Infrastructure', currentLevel: 'Beginner', requiredLevel: 'Intermediate' },
        { skill: 'Mentoring', currentLevel: 'Beginner', requiredLevel: 'Intermediate' },
      ],
      recommendedLearningPath: [
        { title: 'System Design Interview Prep', type: 'course', url: '' },
        { title: 'AWS Solutions Architect Associate', type: 'certification', url: '' },
      ],
      projectExposureSuggestions: ['Lead a module design and rollout end-to-end', 'Shadow a deployment and document the runbook'],
      timelineForImprovement: 'Next 8 weeks',
      confidenceSummary: 'High confidence based on strong ownership scores and consistent upward trend.',
      reasoningSummary: 'Feedback shows high ownership but planning score trails technical execution. Cloud exposure and mentoring are the main gaps to Senior.',
      status: 'completed',
    },
  ];

  await db.collection('aisuggestions').insertMany(aiSuggestions);
  console.log(`Inserted ${aiSuggestions.length} AI suggestions.`);

  // Print IDs for reference
  console.log('\n── Employee IDs ──');
  console.log(`Aarav Mehta:  ${emp1Id}`);
  console.log(`Nisha Rao:   ${emp2Id}`);
  console.log(`Kabir Singh: ${emp3Id}`);

  await connection.close();
  console.log('\nSeed complete. Connection closed.');
}

seed().catch((err) => { console.error(err); process.exit(1); });
