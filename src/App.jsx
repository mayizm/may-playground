import React, { useState, useEffect } from 'react';
import { Upload, FileText, Figma, MessageSquare, LayoutList, ChevronRight, CheckCircle2, AlertCircle, Eye, Sparkles, Image, Type, MessagesSquare, Plus, X, RefreshCw, ArrowRight, Edit3, Trash2, GitCompare, FileUp, FolderOpen, Clock, Users, Search, Settings, ChevronDown, Brain, History, Link, ExternalLink, MoreHorizontal, Star, Archive, Filter, Calendar, Tag, Layers, BookOpen, Zap, Database, Shield, Copy, Download, Check, ChevronUp, Smartphone, Monitor, Bug, FlaskConical, BarChart3, Flag, Target, FileQuestion, AlertTriangle, Workflow, Play, Bookmark, Hash, Grid3X3, List, Table, CircleDot, Rocket, Microscope, CalendarClock, GitBranch } from 'lucide-react';

export default function TestPlanGenerator() {
  const [view, setView] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [step, setStep] = useState(1);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [projectsView, setProjectsView] = useState('your'); // 'your' or 'all'
  const [expandedSections, setExpandedSections] = useState({});
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [previewTab, setPreviewTab] = useState('visual');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    team: '',
    tags: [],
    prd: null,
    prdLink: '',
    techSpec: null,
    techSpecLink: '',
    figma: '',
    slackChannel: '',
    linearProject: '',
    splitFlag: ''
  });

  const [errors, setErrors] = useState({});
  
  // Sample projects with detailed stats
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Words Meaning',
      description: 'Word meanings/translations in Pronunciation Coach drawer',
      status: 'active',
      owner: { name: 'QA Engineer', avatar: 'QE' },
      isYours: true,
      team: 'EPD - Learning Path',
      lastUpdated: '2 hours ago',
      created: 'Jan 12, 2025',
      documents: {
        prd: { name: '[PRD] Add meanings to words', link: 'https://www.notion.so/4f84897bea62461fbbbb4779967080d6' },
        techSpec: { name: '[Tech Spec] Word Meaning (PC x MD x Saved Lines)', link: 'https://www.notion.so/1234' },
        linearProject: { name: 'Word Meaning', link: 'https://linear.app/speak/project/word-meaning' }
      },
      figmaLink: 'https://www.figma.com/design/QqfZLNsGFPIYlzzcvWvPne/Word-Definitions',
      slackChannel: '#word-meaning',
      splitFlag: 'word_meaning',
      starred: true,
      stats: {
        totalTestCases: 89,
        ios: { pass: 42, incomplete: 47 },
        android: { pass: 12, incomplete: 77 },
        analytics: { total: 5, pass: 2, incomplete: 3 }
      }
    },
    {
      id: 2,
      name: 'Onboarding Redesign',
      description: 'New user onboarding flow with personalization',
      status: 'active',
      owner: { name: 'Sarah Kim', avatar: 'SK' },
      isYours: false,
      team: 'EPD - New User Experience',
      lastUpdated: '1 day ago',
      created: 'Jan 8, 2025',
      documents: {
        prd: { name: '[PRD] Onboarding Redesign', link: 'https://www.notion.so/5678' },
        techSpec: { name: '[Tech Spec] Onboarding v2', link: 'https://www.notion.so/9012' },
        linearProject: { name: 'Onboarding Redesign', link: 'https://linear.app/speak/project/onboarding' }
      },
      figmaLink: 'https://www.figma.com/design/abc123',
      slackChannel: '#onboarding-redesign',
      splitFlag: 'onboarding_v2',
      starred: false,
      stats: {
        totalTestCases: 56,
        ios: { pass: 56, incomplete: 0 },
        android: { pass: 48, incomplete: 8 },
        analytics: { total: 8, pass: 8, incomplete: 0 }
      }
    },
    {
      id: 3,
      name: 'Payment Flow Update',
      description: 'Updated subscription and payment processing',
      status: 'completed',
      owner: { name: 'Mike Chen', avatar: 'MC' },
      isYours: false,
      team: 'EPD - Growth',
      lastUpdated: '1 week ago',
      created: 'Dec 15, 2024',
      documents: {
        prd: { name: '[PRD] Payment Flow', link: 'https://www.notion.so/3456' },
        techSpec: { name: '[Tech Spec] Payments v3', link: 'https://www.notion.so/7890' },
        linearProject: { name: 'Payment Flow', link: 'https://linear.app/speak/project/payments' }
      },
      figmaLink: 'https://www.figma.com/design/def456',
      slackChannel: '#payments',
      splitFlag: 'payment_v3',
      starred: false,
      stats: {
        totalTestCases: 34,
        ios: { pass: 34, incomplete: 0 },
        android: { pass: 34, incomplete: 0 },
        analytics: { total: 6, pass: 6, incomplete: 0 }
      }
    },
    {
      id: 4,
      name: 'Speaking Score Improvements',
      description: 'Enhanced pronunciation scoring algorithm',
      status: 'draft',
      owner: { name: 'QA Engineer', avatar: 'QE' },
      isYours: true,
      team: 'EPD - Speak Score',
      lastUpdated: '3 days ago',
      created: 'Jan 10, 2025',
      documents: {
        prd: { name: '[PRD] Speaking Score v2', link: 'https://www.notion.so/1111' },
        techSpec: { name: '[Tech Spec] Score Algorithm', link: 'https://www.notion.so/2222' },
        linearProject: null
      },
      figmaLink: '',
      slackChannel: '#speak-score',
      splitFlag: 'speak_score_v2',
      starred: true,
      stats: {
        totalTestCases: 22,
        ios: { pass: 0, incomplete: 22 },
        android: { pass: 0, incomplete: 22 },
        analytics: { total: 3, pass: 0, incomplete: 3 }
      }
    }
  ]);

  // Generated test plan structure matching Notion format
  const [generatedPlan, setGeneratedPlan] = useState({
    title: '[Test Plan] Words Meaning',
    icon: '/icons/chemistry_green.svg',
    status: 'In progress',
    objectives: {
      inScope: [
        'Word meanings/translations displayed in the Pronunciation Coach (PC) drawer',
        'Updated PC drawer design (dimensions, spacing, rounded corners, new mic icon)',
        'Premium gating moved from drawer open to record/mic button tap',
        'New FTUX tooltips for meanings and PC (separate onboarding flows)',
        'Magic Dictionary icon in PC drawer to access full MD page',
        'Analytics events for feature interactions',
        'Feature flag behavior (`word_meaning` split)'
      ],
      outOfScope: [
        'PC support for additional languages beyond XX-EN',
        'Magic Dictionary improvements or full MD drawer redesign',
        'Bookmark/saving visual overhaul',
        'Saved Words page showing translations (stretch goal)',
        'Backfilling meanings for existing saved words'
      ]
    },
    documents: {
      prd: { name: '[PRD] Add meanings to words', link: 'https://www.notion.so/4f84897bea62461fbbbb4779967080d6' },
      techSpec: { name: '[Tech Spec] Word Meaning (PC x MD x Saved Lines)', link: 'https://www.notion.so/1234' },
      linearProject: { name: 'Word Meaning', link: 'https://linear.app/speak/project/word-meaning' },
      splitFlag: 'word_meaning'
    },
    sections: [
      {
        id: 'main-flows',
        type: 'main-flow',
        title: 'Main Flows (Happy Paths)',
        icon: Play,
        color: 'emerald',
        subsections: [
          {
            id: 'pc-drawer-meaning',
            title: 'PC Drawer - Meaning Display',
            testCases: [
              {
                id: 'tc-1',
                scenario: 'Single meaning word displays correctly',
                steps: '1. Open series lesson (XX_EN course)\n2. Tap on a word with single meaning\n3. Verify PC drawer shows word meaning/translation',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-2',
                scenario: 'Multiple meanings word displays all meanings',
                steps: '1. Open series lesson (XX_EN course)\n2. Tap on a word with multiple meanings\n3. Verify PC drawer shows ALL meanings separated',
                ios: '',
                android: '',
                isNew: true,
                isModified: false
              },
              {
                id: 'tc-3',
                scenario: 'Meaning loads alongside PC data',
                steps: '1. Tap on a word in speaking card\n2. Verify translation endpoint is called in parallel with PC\n3. Verify meaning displays without blocking PC data',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          },
          {
            id: 'pc-drawer-design',
            title: 'PC Drawer Design Updates',
            figmaLink: 'https://www.figma.com/design/QqfZLNsGFPIYlzzcvWvPne/Word-Definitions?node-id=157-6134',
            testCases: [
              {
                id: 'tc-4',
                scenario: 'New drawer dimensions and spacing',
                steps: '1. Open PC drawer\n2. Verify updated dimensions match Figma spec\n3. Verify proper spacing between elements',
                ios: '',
                android: '',
                isNew: false,
                isModified: true
              },
              {
                id: 'tc-5',
                scenario: 'Updated rounded corners',
                steps: '1. Open PC drawer\n2. Verify rounded corners match new design',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          }
        ]
      },
      {
        id: 'secondary-flows',
        type: 'secondary-flow',
        title: 'Secondary Flows',
        icon: GitBranch,
        color: 'blue',
        subsections: [
          {
            id: 'premium-gating',
            title: 'Premium/Free User Gating',
            testCases: [
              {
                id: 'tc-6',
                scenario: 'Drawer opens without paywall for free users',
                steps: '1. Use free account\n2. Tap on any word\n3. Verify PC drawer opens without upgrade modal',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-7',
                scenario: 'Free user can view meaning UNLIMITED times',
                steps: '1. Use free account\n2. Tap on many different words (10+)\n3. Verify meaning is displayed every time without paywall',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-8',
                scenario: 'Paywall appears on 6th recording attempt',
                steps: '1. Use free account\n2. Complete 5 successful recordings\n3. Attempt 6th recording (tap mic/record)\n4. Verify upgrade modal appears',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          },
          {
            id: 'ftux-tooltips',
            title: 'FTUX Tooltips',
            testCases: [
              {
                id: 'tc-9',
                scenario: 'Meaning tooltip appears after completing 2nd speaking card',
                steps: '1. New user or reset FTUX state\n2. Complete recording on 1st speaking card\n3. Complete recording on 2nd speaking card\n4. After 2nd card completion, verify meaning tooltip appears',
                ios: '',
                android: '',
                isNew: true,
                isModified: false
              }
            ]
          },
          {
            id: 'magic-dictionary',
            title: 'Magic Dictionary Integration',
            testCases: [
              {
                id: 'tc-10',
                scenario: 'MD icon appears in PC drawer',
                steps: '1. Open PC drawer for a word\n2. Verify MD icon/button is visible',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-11',
                scenario: 'Tapping MD icon opens Magic Dictionary',
                steps: '1. Open PC drawer\n2. Tap MD icon\n3. Verify full MD page opens for the word',
                ios: '✅ #14204',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          }
        ]
      },
      {
        id: 'edge-cases',
        type: 'edge-case',
        title: 'Edge Cases & Error Handling',
        icon: AlertTriangle,
        color: 'amber',
        subsections: [
          {
            id: 'error-handling',
            title: 'Error Scenarios',
            testCases: [
              {
                id: 'tc-12',
                scenario: 'Network error during translation fetch',
                steps: '1. Simulate network failure\n2. Tap on word\n3. Verify graceful error handling',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-13',
                scenario: 'Slow translation API response',
                steps: '1. Simulate slow network\n2. Verify loading state or PC shows without blocking',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-14',
                scenario: 'Pronunciation call fails → sheet auto-dismisses',
                steps: '1. Simulate pronunciation endpoint failure\n2. Tap on a word\n3. Verify bottom sheet auto-dismisses\n4. Verify no crash or error modal shown',
                ios: '',
                android: '',
                isNew: true,
                isModified: false
              },
              {
                id: 'tc-15',
                scenario: 'Both calls fail → sheet auto-dismisses',
                steps: '1. Simulate both pronunciation and translation endpoint failures\n2. Tap on a word\n3. Verify bottom sheet auto-dismisses',
                ios: '',
                android: '',
                isNew: true,
                isModified: false
              }
            ]
          }
        ]
      },
      {
        id: 'regression',
        type: 'regression',
        title: 'Regression Testing',
        icon: RefreshCw,
        color: 'purple',
        subsections: [
          {
            id: 'core-functionality',
            title: 'Core PC Functionality',
            testCases: [
              {
                id: 'tc-16',
                scenario: 'Existing PC functionality preserved',
                steps: '1. With flag ON\n2. Record pronunciation, get feedback\n3. Verify core PC works',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-17',
                scenario: 'Saving words still works',
                steps: '1. Bookmark a word from PC\n2. Verify saved to Saved Words',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-18',
                scenario: 'Dark mode styling',
                steps: '1. Enable dark mode\n2. Verify PC drawer displays correctly',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              },
              {
                id: 'tc-19',
                scenario: 'Accessibility - screen readers',
                steps: '1. Enable VoiceOver/TalkBack\n2. Verify PC drawer is accessible',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          }
        ]
      },
      {
        id: 'analytics',
        type: 'analytics',
        title: 'Analytics Events',
        icon: BarChart3,
        color: 'cyan',
        isAnalytics: true,
        events: [
          {
            id: 'ev-1',
            event: 'PC Drawer Opened',
            type: 'track',
            trigger: 'User opens PC drawer by tapping word',
            properties: 'sessionId, lessonId, contextId, word',
            ios: '',
            android: ''
          },
          {
            id: 'ev-2',
            event: 'Meaning Displayed',
            type: 'track',
            trigger: 'Translation is shown in drawer',
            properties: 'sessionId, word, translation',
            ios: '',
            android: ''
          },
          {
            id: 'ev-3',
            event: 'Meaning Tooltip Shown',
            type: 'track',
            trigger: 'FTUX meaning tooltip appears',
            properties: 'sessionId, contextId',
            ios: '',
            android: ''
          },
          {
            id: 'ev-4',
            event: 'MD Button Tapped',
            type: 'track',
            trigger: 'User taps Magic Dictionary icon',
            properties: 'sessionId, word',
            ios: '',
            android: ''
          },
          {
            id: 'ev-5',
            event: 'Paywall Shown (PC)',
            type: 'track',
            trigger: 'Upgrade modal triggered from PC',
            properties: 'sessionId, trigger (word_tap or record_tap)',
            ios: '',
            android: ''
          }
        ]
      },
      {
        id: 'future-m2',
        type: 'future',
        title: 'M2 Test Cases (Placeholder)',
        icon: Rocket,
        color: 'slate',
        isFuture: true,
        subsections: [
          {
            id: 'consolidated-saved',
            title: 'Consolidated Saved Items System',
            testCases: [
              {
                id: 'tc-m2-1',
                scenario: 'Saved Lines, Saved Words (PC), and MD items unified',
                steps: '1. Save items from different sources (lesson line, PC word, MD word)\n2. Navigate to Saved Items\n3. Verify all items appear in single unified list',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          },
          {
            id: 'review-flow',
            title: 'Saved Words Review Flow',
            testCases: [
              {
                id: 'tc-m2-2',
                scenario: 'Generate series lesson from Saved Words',
                steps: '1. Navigate to Saved Words/Lines\n2. Tap review/practice option\n3. Verify series lesson is generated from saved words',
                ios: '',
                android: '',
                isNew: false,
                isModified: false
              }
            ]
          }
        ]
      }
    ],
    bugBash: [
      { date: '1/12', milestone: 'Bug Bash 1', focus: 'Core PC drawer updates, meaning display, premium gating' },
      { date: '1/15', milestone: 'Bug Bash 2', focus: 'FTUX tooltips, MD integration, analytics events' }
    ]
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const getSectionIcon = (type) => {
    const icons = {
      'main-flow': Play,
      'secondary-flow': GitBranch,
      'edge-case': AlertTriangle,
      'regression': RefreshCw,
      'analytics': BarChart3,
      'future': Rocket
    };
    return icons[type] || FileText;
  };

  const getSectionColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      slate: 'bg-slate-50 border-slate-200 text-slate-500'
    };
    return colors[color] || colors.slate;
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!newProject.prd && !newProject.prdLink) newErrors.prd = 'PRD is required';
    if (!newProject.techSpec && !newProject.techSpecLink) newErrors.techSpec = 'Tech Spec is required';
    if (!newProject.figma) newErrors.figma = 'Figma link is required';
    if (!newProject.slackChannel) newErrors.slackChannel = 'Slack channel is required';
    if (!newProject.splitFlag) newErrors.splitFlag = 'Feature flag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateInputs()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreviewModal(true);
    }, 2000);
  };

  // Project card component
  const ProjectCard = ({ project }) => {
    const iosProgress = project.stats ? Math.round((project.stats.ios.pass / project.stats.totalTestCases) * 100) : 0;
    const androidProgress = project.stats ? Math.round((project.stats.android.pass / project.stats.totalTestCases) * 100) : 0;
    
    const getStatusColor = (status) => {
      switch(status) {
        case 'active': return 'bg-emerald-100 text-emerald-700';
        case 'completed': return 'bg-blue-100 text-blue-700';
        case 'draft': return 'bg-amber-100 text-amber-700';
        default: return 'bg-slate-100 text-slate-600';
      }
    };
    
    return (
      <div 
        onClick={() => { setSelectedProject(project); setView('project-detail'); }}
        className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${project.status === 'completed' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : project.status === 'draft' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-teal-500 to-emerald-600'}`}>
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">{project.name}</h3>
              <p className="text-xs text-slate-500">{project.team}</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className={`p-1.5 rounded-lg transition-colors ${project.starred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
          >
            <Star className="w-4 h-4" fill={project.starred ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
        
        {/* Progress bars */}
        {project.stats && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-16">iOS</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${iosProgress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 w-12 text-right">{project.stats.ios.pass}/{project.stats.totalTestCases}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-16">Android</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${androidProgress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 w-12 text-right">{project.stats.android.pass}/{project.stats.totalTestCases}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {project.stats?.totalTestCases || 0} cases
            </span>
            <span className={`px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <span>Updated {project.lastUpdated}</span>
        </div>
      </div>
    );
  };

  // Documents section with auto-links
  const DocumentsSection = ({ documents }) => (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Documents
      </h4>
      <div className="space-y-2">
        <a href={documents.prd?.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
          <FileText className="w-4 h-4" />
          <span className="font-medium">PRD:</span> {documents.prd?.name}
          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
        </a>
        <a href={documents.techSpec?.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
          <FileText className="w-4 h-4" />
          <span className="font-medium">Tech Spec:</span> {documents.techSpec?.name}
          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
        </a>
        {documents.linearProject && (
          <a href={documents.linearProject?.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline">
            <LayoutList className="w-4 h-4" />
            <span className="font-medium">Linear Project:</span> {documents.linearProject?.name}
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          </a>
        )}
        {documents.splitFlag && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Flag className="w-4 h-4" />
            <span className="font-medium">Split Flag:</span>
            <code className="px-2 py-0.5 bg-slate-200 rounded text-xs font-mono">{documents.splitFlag}</code>
          </div>
        )}
      </div>
    </div>
  );

  // Test case table with numbered steps
  const TestCaseTable = ({ testCases, sectionType }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 font-semibold text-slate-700 w-1/4">Scenario</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700 w-1/2">Steps</th>
            <th className="text-center py-2 px-3 font-semibold text-slate-700 w-20">iOS</th>
            <th className="text-center py-2 px-3 font-semibold text-slate-700 w-20">Android</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, idx) => (
            <tr 
              key={tc.id} 
              className={`border-b border-slate-100 hover:bg-slate-50 ${tc.isNew ? 'bg-emerald-50' : tc.isModified ? 'bg-amber-50' : ''}`}
            >
              <td className="py-3 px-3 align-top">
                <div className="flex items-start gap-2">
                  {tc.isNew && <span className="px-1.5 py-0.5 text-xs bg-emerald-500 text-white rounded">NEW</span>}
                  {tc.isModified && <span className="px-1.5 py-0.5 text-xs bg-amber-500 text-white rounded">MOD</span>}
                  <span className="text-slate-800">{tc.scenario}</span>
                </div>
              </td>
              <td className="py-3 px-3 align-top">
                <div className="space-y-1 text-slate-600">
                  {tc.steps.split('\n').map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-mono text-xs mt-0.5">{step.match(/^\d+\./) ? '' : `${i+1}.`}</span>
                      <span>{step.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-3 text-center align-top">
                {tc.ios ? (
                  <span className="text-emerald-600">{tc.ios}</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="py-3 px-3 text-center align-top">
                {tc.android ? (
                  <span className="text-emerald-600">{tc.android}</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Analytics events table
  const AnalyticsTable = ({ events }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 font-semibold text-slate-700">Event</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700 w-16">Type</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700">Trigger</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700">Required Properties</th>
            <th className="text-center py-2 px-3 font-semibold text-slate-700 w-16">iOS</th>
            <th className="text-center py-2 px-3 font-semibold text-slate-700 w-16">Android</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-3 font-medium text-slate-800">{ev.event}</td>
              <td className="py-3 px-3">
                <code className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">{ev.type}</code>
              </td>
              <td className="py-3 px-3 text-slate-600">{ev.trigger}</td>
              <td className="py-3 px-3">
                <code className="text-xs text-slate-500">{ev.properties}</code>
              </td>
              <td className="py-3 px-3 text-center">
                {ev.ios ? <span className="text-emerald-600">{ev.ios}</span> : <span className="text-slate-300">—</span>}
              </td>
              <td className="py-3 px-3 text-center">
                {ev.android ? <span className="text-emerald-600">{ev.android}</span> : <span className="text-slate-300">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Bug bash schedule table
  const BugBashTable = ({ schedule }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 font-semibold text-slate-700 w-24">Date</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700 w-32">Milestone</th>
            <th className="text-left py-2 px-3 font-semibold text-slate-700">Focus Areas</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-3 font-medium text-slate-800">{item.date}</td>
              <td className="py-3 px-3">
                <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium">{item.milestone}</span>
              </td>
              <td className="py-3 px-3 text-slate-600">{item.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Test Plan Preview Modal
  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Test Plan Preview</h2>
              <p className="text-xs text-slate-500">Review before exporting to Notion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setPreviewTab('visual')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${previewTab === 'visual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Visual
              </button>
              <button 
                onClick={() => setPreviewTab('notion')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${previewTab === 'notion' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Notion Format
              </button>
            </div>
            <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewTab === 'visual' ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Title */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{generatedPlan.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{generatedPlan.status}</span>
                    <span className="text-sm text-slate-500">•</span>
                    <span className="text-sm text-slate-500">Feature Flag: <code className="bg-slate-100 px-1 rounded">{generatedPlan.documents.splitFlag}</code></span>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-800 mb-4">🎯 Objectives & Scope</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> In-scope
                    </h3>
                    <ul className="space-y-1.5">
                      {generatedPlan.objectives.inScope.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-rose-700 mb-2 flex items-center gap-2">
                      <X className="w-4 h-4" /> Out of scope
                    </h3>
                    <ul className="space-y-1.5">
                      {generatedPlan.objectives.outOfScope.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-rose-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Documents with auto-links */}
              <DocumentsSection documents={generatedPlan.documents} />

              {/* Test Sections */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  🧪 Test Cases / Scenarios
                </h2>
                
                {generatedPlan.sections.map((section) => {
                  const SectionIcon = getSectionIcon(section.type);
                  const isExpanded = expandedSections[section.id] !== false;
                  
                  return (
                    <div key={section.id} className={`rounded-xl border-2 overflow-hidden ${getSectionColor(section.color)}`}>
                      <button 
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <SectionIcon className="w-5 h-5" />
                          <span className="font-semibold">{section.title}</span>
                          {section.isFuture && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full">Placeholder</span>
                          )}
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="bg-white p-4 border-t">
                          {section.isAnalytics ? (
                            <AnalyticsTable events={section.events} />
                          ) : (
                            <div className="space-y-6">
                              {section.subsections?.map((sub) => (
                                <div key={sub.id}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <h4 className="font-semibold text-slate-700">{sub.title}</h4>
                                    {sub.figmaLink && (
                                      <a href={sub.figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                        <Figma className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                  <TestCaseTable testCases={sub.testCases} sectionType={section.type} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bug Bash Schedule */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-rose-500" />
                  Bug Bash Schedule
                </h2>
                <BugBashTable schedule={generatedPlan.bugBash} />
              </div>
            </div>
          ) : (
            /* Notion Format Preview */
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#FBFBFA] rounded-lg border border-slate-200 p-8 font-['ui-sans-serif'] text-[#37352F]">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl">🧪</span>
                  <h1 className="text-3xl font-bold">{generatedPlan.title}</h1>
                </div>
                
                <div className="space-y-6 text-sm">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">🗓️ Test Plan: Words Meaning</h2>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-base mb-2">Objectives & Scope</h3>
                    <h4 className="font-medium text-sm text-slate-600 mb-1">In-scope</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-sm mb-3">
                      {generatedPlan.objectives.inScope.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <h4 className="font-medium text-sm text-slate-600 mb-1">Out of scope</h4>
                    <ul className="list-disc list-inside space-y-0.5 text-sm">
                      {generatedPlan.objectives.outOfScope.slice(0, 2).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-slate-600 mb-2">Documents</h4>
                    <ul className="space-y-1">
                      <li><strong>PRD:</strong> <a href="#" className="text-blue-600 underline">{generatedPlan.documents.prd.name}</a></li>
                      <li><strong>Tech Spec:</strong> <a href="#" className="text-blue-600 underline">{generatedPlan.documents.techSpec.name}</a></li>
                      <li><strong>Linear Project:</strong> <a href="#" className="text-blue-600 underline">{generatedPlan.documents.linearProject.name}</a></li>
                      <li><strong>Split Flag:</strong> <code className="bg-slate-100 px-1 rounded text-xs">{generatedPlan.documents.splitFlag}</code></li>
                    </ul>
                  </div>

                  <hr className="border-slate-200" />

                  <div>
                    <h2 className="text-xl font-semibold mb-3">🧪 Test Cases / Scenarios</h2>
                    <p className="text-xs text-slate-500 mb-4"><strong>Feature Flag:</strong> <code>{generatedPlan.documents.splitFlag}</code></p>
                    
                    <h3 className="font-semibold mb-2">1) PC Drawer - Meaning Display</h3>
                    <h4 className="font-medium text-sm mb-2">Show Meaning Correctly</h4>
                    
                    <div className="border border-slate-200 rounded overflow-hidden mb-4">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left p-2 border-b">Scenario</th>
                            <th className="text-left p-2 border-b">Steps</th>
                            <th className="text-center p-2 border-b w-16">iOS</th>
                            <th className="text-center p-2 border-b w-16">Android</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 align-top">Single meaning word displays correctly</td>
                            <td className="p-2 align-top">
                              <div>1. Open series lesson (XX_EN course)</div>
                              <div>2. Tap on a word with single meaning</div>
                              <div>3. Verify PC drawer shows word meaning/translation</div>
                            </td>
                            <td className="p-2 text-center text-emerald-600">✅ #14204</td>
                            <td className="p-2 text-center text-slate-300">—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-slate-400 text-xs italic">... more test cases ...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> NEW test cases
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span> MODIFIED test cases
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back to Edit
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export to Notion
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Input field component
  const InputField = ({ icon: Icon, label, required, field, type = 'file', placeholder, linkField }) => (
    <div className={`p-4 rounded-xl border-2 transition-all ${errors[field] ? 'border-red-300 bg-red-50' : (newProject[field] || newProject[linkField]) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${errors[field] ? 'bg-red-100' : (newProject[field] || newProject[linkField]) ? 'bg-emerald-100' : 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${errors[field] ? 'text-red-600' : (newProject[field] || newProject[linkField]) ? 'text-emerald-600' : 'text-slate-500'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-slate-800">{label}</span>
            {required && <span className="text-xs text-red-500">Required</span>}
          </div>
          
          {type === 'file' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{newProject[field]?.name || 'Upload file'}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setNewProject(prev => ({ ...prev, [field]: e.target.files?.[0] || null }))}
                  />
                </label>
                <span className="text-xs text-slate-400">or</span>
              </div>
              <input
                type="url"
                placeholder="Paste Notion link"
                value={newProject[linkField] || ''}
                onChange={(e) => setNewProject(prev => ({ ...prev, [linkField]: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={newProject[field] || ''}
              onChange={(e) => setNewProject(prev => ({ ...prev, [field]: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
          
          {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Feature QA Hub</h1>
              <p className="text-xs text-slate-500">Test planning & tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
              />
            </div>
            <button 
              onClick={() => setView('create')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'projects' && (
          <div className="space-y-6">
            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                <button
                  onClick={() => setProjectsView('your')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${projectsView === 'your' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Your Projects
                </button>
                <button
                  onClick={() => setProjectsView('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${projectsView === 'all' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All Projects
                </button>
              </div>
            </div>

            {/* Overall Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {projectsView === 'your'
                    ? projects.filter(p => p.isYours).length
                    : projects.length}
                </p>
                <p className="text-xs text-slate-500">Total Projects</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Play className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {projectsView === 'your'
                    ? projects.filter(p => p.isYours && p.status === 'active').length
                    : projects.filter(p => p.status === 'active').length}
                </p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {projectsView === 'your'
                    ? projects.filter(p => p.isYours && p.status === 'draft').length
                    : projects.filter(p => p.status === 'draft').length}
                </p>
                <p className="text-xs text-slate-500">Draft</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {projectsView === 'your'
                    ? projects.filter(p => p.isYours && p.status === 'completed').length
                    : projects.filter(p => p.status === 'completed').length}
                </p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {projectsView === 'your' ? 'Your Projects' : 'All Projects'}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  <option value="all">All Teams</option>
                  <option value="EPD - Learning Path">EPD - Learning Path</option>
                  <option value="EPD - New User Experience">EPD - New User Experience</option>
                  <option value="EPD - Growth">EPD - Growth</option>
                  <option value="EPD - Speak Score">EPD - Speak Score</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects
                .filter(p => projectsView === 'all' || p.isYours)
                .filter(p => filterStatus === 'all' || p.status === filterStatus)
                .filter(p => filterTeam === 'all' || p.team === filterTeam)
                .map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}

              {/* Add new project card */}
              <button
                onClick={() => setView('create')}
                className="h-64 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50/50 transition-all flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <span className="font-medium text-slate-500 group-hover:text-teal-700 transition-colors">Create New Project</span>
              </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setView('projects')} className="p-2 hover:bg-slate-100 rounded-lg">
                <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Create New Test Plan Project</h2>
                <p className="text-sm text-slate-500">Upload documentation to generate test cases</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= s ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {s}
                  </div>
                  <span className={`text-sm ${step >= s ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {s === 1 ? 'Upload Documents' : 'Review & Generate'}
                  </span>
                  {s < 2 && <ChevronRight className="w-4 h-4 text-slate-300 ml-2" />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <InputField 
                    icon={FileText} 
                    label="PRD (Product Requirements Document)" 
                    required 
                    field="prd" 
                    linkField="prdLink"
                    type="file" 
                  />
                  <InputField 
                    icon={FileText} 
                    label="Tech Spec" 
                    required 
                    field="techSpec" 
                    linkField="techSpecLink"
                    type="file" 
                  />
                  <InputField 
                    icon={Figma} 
                    label="Figma Design Link" 
                    required 
                    field="figma" 
                    type="text" 
                    placeholder="https://www.figma.com/design/..." 
                  />
                  <InputField 
                    icon={MessageSquare} 
                    label="Feature Slack Channel" 
                    required 
                    field="slackChannel" 
                    type="text" 
                    placeholder="#feature-channel" 
                  />
                  <InputField 
                    icon={LayoutList} 
                    label="Linear Project (optional)" 
                    field="linearProject" 
                    type="text" 
                    placeholder="https://linear.app/team/project/..." 
                  />
                  <InputField 
                    icon={Flag} 
                    label="Feature Flag / Split" 
                    required
                    field="splitFlag" 
                    type="text" 
                    placeholder="feature_flag_name" 
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => { if (validateInputs()) setStep(2); }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Project Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">PRD</p>
                        <p className="text-slate-800 font-medium">{newProject.prd?.name || newProject.prdLink || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Tech Spec</p>
                        <p className="text-slate-800 font-medium">{newProject.techSpec?.name || newProject.techSpecLink || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Figma className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Figma</p>
                        <p className="text-slate-800 font-medium truncate max-w-xs">{newProject.figma || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Slack Channel</p>
                        <p className="text-slate-800 font-medium">{newProject.slackChannel || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Sparkles className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">AI Test Plan Generation</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        Claude will analyze your documents and generate comprehensive test cases including:
                      </p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Main Flows (Happy Paths)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secondary Flows</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Edge Cases & Error Handling</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Regression Testing</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Analytics Events (from PRD)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Future Milestone Placeholders</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bug Bash Schedule</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Test Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'project-detail' && selectedProject && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => { setView('projects'); setSelectedProject(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{selectedProject.name}</h2>
                <p className="text-sm text-slate-500">{selectedProject.description}</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                View Test Plan
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <DocumentsSection documents={selectedProject.documents} />
                
                {/* Expanded Quick Stats */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Quick Stats</h3>
                  
                  {/* Total Test Cases */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                          <Microscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Total Test Cases</p>
                          <p className="text-2xl font-bold text-teal-700">{selectedProject.stats?.totalTestCases || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* iOS Stats */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">iOS</span>
                      </div>
                      <span className="font-medium text-slate-700">iOS Testing</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs text-emerald-600 font-medium">Pass</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-700">{selectedProject.stats?.ios?.pass || 0}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-xs text-slate-500 font-medium">Incomplete</span>
                        </div>
                        <p className="text-xl font-bold text-slate-600">{selectedProject.stats?.ios?.incomplete || 0}</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${selectedProject.stats ? (selectedProject.stats.ios.pass / selectedProject.stats.totalTestCases) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Android Stats */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <span className="font-medium text-slate-700">Android Testing</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">Pass</span>
                        </div>
                        <p className="text-xl font-bold text-blue-700">{selectedProject.stats?.android?.pass || 0}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-xs text-slate-500 font-medium">Incomplete</span>
                        </div>
                        <p className="text-xl font-bold text-slate-600">{selectedProject.stats?.android?.incomplete || 0}</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${selectedProject.stats ? (selectedProject.stats.android.pass / selectedProject.stats.totalTestCases) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Analytics Stats */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
                        <BarChart3 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-medium text-slate-700">Analytics Events</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                        <p className="text-xs text-cyan-600 font-medium mb-1">Total</p>
                        <p className="text-xl font-bold text-cyan-700">{selectedProject.stats?.analytics?.total || 0}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs text-emerald-600 font-medium">Pass</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-700">{selectedProject.stats?.analytics?.pass || 0}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500 font-medium">Incomplete</span>
                        </div>
                        <p className="text-xl font-bold text-slate-600">{selectedProject.stats?.analytics?.incomplete || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Project Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Status</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{selectedProject.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Team</span>
                      <span className="text-slate-800">{selectedProject.team}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Created</span>
                      <span className="text-slate-800">{selectedProject.created}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Last Updated</span>
                      <span className="text-slate-800">{selectedProject.lastUpdated}</span>
                    </div>
                    {selectedProject.splitFlag && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Feature Flag</span>
                        <code className="px-2 py-0.5 bg-slate-100 rounded text-xs">{selectedProject.splitFlag}</code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <a href={selectedProject.figmaLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-sm text-blue-600">
                      <Figma className="w-4 h-4" />
                      Figma Design
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                    <a href="#" className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-sm text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                      {selectedProject.slackChannel}
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {showPreviewModal && <PreviewModal />}
    </div>
  );
}
