
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Settings, 
  Sparkles, 
  User, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Monitor,
  FolderOpen,
  Calendar,
  Save,
  Check
} from 'lucide-react';
import { EmploymentPlanData, PageType } from './types';
import { generateEmploymentSuggestions } from './services/geminiService';
import SignaturePad from './components/SignaturePad';

const STORAGE_KEY = 'employment_plan_pro_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PageType>(PageType.PLANNER);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [data, setData] = useState<EmploymentPlanData>({
    firstName: 'Joel',
    lastName: '[YourLastname]',
    field: 'Supply chain and logistics',
    position: 'Procurement Officer',
    company: 'Startup Lions',
    companyUrl: 'https://startuplions.org',
    requirements: [
      'Degree in procurement or supply chain management',
      'Experience with supplier management',
      'Compliance knowledge',
      'Strong reporting skills'
    ],
    location: 'Nairobi, Kenya',
    reason: 'they focus on sustainable development and innovation, which aligns with my career goals',
    jobOptions: ['Procurement Officer', 'Supply Chain Analyst', 'Logistics Coordinator'],
    selectedJobOption: 'Procurement Officer',
    signatureData: null,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const handleInputChange = (field: keyof EmploymentPlanData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (saveStatus === 'saved') setSaveStatus('idle');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  const handleAIHelp = async () => {
    if (!data.field) {
      alert("Please enter a field of interest first (e.g., Software Engineering)");
      return;
    }
    setIsLoading(true);
    try {
      const suggestions = await generateEmploymentSuggestions(data.field);
      setData(prev => ({
        ...prev,
        jobOptions: suggestions.jobTitles,
        selectedJobOption: suggestions.jobTitles[0],
        companyUrl: suggestions.companyUrl,
        requirements: suggestions.requirements
      }));
    } catch (error) {
      console.error("Gemini failed:", error);
      alert("AI was unable to generate suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 print:bg-white">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Employment Plan Builder</h1>
            <p className="text-xs text-gray-500">Professional Document System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab(PageType.PLANNER)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === PageType.PLANNER ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            1. Edit Details
          </button>
          <button 
            onClick={() => setActiveTab(PageType.PREVIEW)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === PageType.PREVIEW ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            2. View Document
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button 
            onClick={printDocument}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Printer size={16} /> Print PDF
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        {activeTab === PageType.PLANNER ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Info */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <User className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Part A & B: User Identity</h2>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-normal">Page Setup Info</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={data.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={data.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
            </section>

            {/* Employment Details */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={handleAIHelp}
                  disabled={isLoading || !data.field}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  <Sparkles size={16} /> {isLoading ? "Suggesting..." : "Auto-Fill Suggestions"}
                </button>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Employment Considerations</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Interest</label>
                  <input 
                    type="text" 
                    value={data.field}
                    onChange={(e) => handleInputChange('field', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Job Title (Part C Dropdown)</label>
                    <select 
                      value={data.selectedJobOption}
                      onChange={(e) => handleInputChange('selectedJobOption', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md outline-none"
                    >
                      {data.jobOptions.length > 0 ? (
                        data.jobOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)
                      ) : (
                        <option value={data.selectedJobOption}>{data.selectedJobOption}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region/City</label>
                    <input 
                      type="text" 
                      value={data.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Business/Organization</label>
                    <input 
                      type="text" 
                      value={data.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization URL</label>
                    <input 
                      type="text" 
                      value={data.companyUrl}
                      onChange={(e) => handleInputChange('companyUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for choosing this company</label>
                  <textarea 
                    value={data.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none h-20" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Likely Requirements (One per line)</label>
                  <textarea 
                    value={data.requirements.join('\n')}
                    onChange={(e) => handleInputChange('requirements', e.target.value.split('\n'))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none h-32" 
                    placeholder="Enter skills, degrees, or certifications..."
                  />
                </div>
              </div>
            </section>

            {/* Signature Area */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Drawing & Finalization</h2>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Drawing Tool: Add Your Signature</label>
                <SignaturePad 
                  onSave={(img) => handleInputChange('signatureData', img)}
                  onClear={() => handleInputChange('signatureData', null)}
                />
                
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border-2 ${
                      saveStatus === 'saved' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                   >
                    {saveStatus === 'saving' ? (
                      <span className="animate-pulse">Saving...</span>
                    ) : saveStatus === 'saved' ? (
                      <><Check size={18} /> Saved Successfully!</>
                    ) : (
                      <><Save size={18} /> Save Progress</>
                    )}
                   </button>

                   <button 
                    onClick={() => setActiveTab(PageType.PREVIEW)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                   >
                    Generate Document Preview <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* PREVIEW MODE: Multi-page Layout */
          <div className="flex flex-col items-center gap-8 pb-20 print:gap-0 print:p-0">
            
            {/* Page 1: Part A */}
            <div className="doc-page relative font-serif text-gray-900 print:m-0 print:shadow-none break-after-page">
              <Header pageNum={1} />
              <div className="mt-12">
                <h1 className="text-xl font-bold underline mb-12">My Folder</h1>
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl max-w-lg mx-auto">
                  <FolderOpen size={80} className="text-yellow-500 mb-4" />
                  <div className="bg-white p-4 border border-gray-200 rounded shadow-md text-center">
                    <p className="font-mono text-sm font-bold">Google Doc Task[{data.firstName}_{data.lastName}]</p>
                    <p className="text-[10px] text-gray-400 mt-2 italic uppercase">Desktop Folder Mockup Screenshot</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                    <Monitor size={14} /> Centered Image on Page
                  </div>
                </div>
              </div>
              <Footer name={`${data.firstName} ${data.lastName}`} />
            </div>

            {/* Page 2: Part B */}
            <div className="doc-page relative font-serif text-gray-900 print:m-0 print:shadow-none break-after-page">
              <Header pageNum={2} />
              <div className="mt-12">
                <h2 className="text-xl font-bold underline mb-8">Employment Considerations</h2>
                <div className="space-y-8 text-[12pt] leading-relaxed">
                  <div className="flex flex-col gap-2">
                    <p className="font-medium italic text-gray-600">What position, and in which field, would you like to seek employment?</p>
                    <p className="pl-4 border-l-2 border-blue-100">I would like to seek employment as a {data.selectedJobOption} in the {data.field} field.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium italic text-gray-600">What is the web address of a business or organization that hires for this position?</p>
                    <p className="pl-4 border-l-2 border-blue-100">
                      {data.company} hires for this position. Their website is <a href={data.companyUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{data.company}</a>.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-medium italic text-gray-600">What are the requirements you will likely need for this position?</p>
                    <p className="pl-4 border-l-2 border-blue-100">
                      The requirements likely include {data.requirements.join(', ').toLowerCase()}.
                    </p>
                  </div>
                </div>
              </div>
              <Footer name={`${data.firstName} ${data.lastName}`} />
            </div>

            {/* Page 3: Part C & Final */}
            <div className="doc-page relative font-serif text-gray-900 print:m-0 print:shadow-none">
              <Header pageNum={3} />
              <div className="mt-12">
                <h2 className="text-xl font-bold underline mb-8">My Future Employment</h2>
                <div className="ml-12 text-justify leading-loose text-[12pt]">
                  <p>
                    I would like to work as a/an <span className="font-bold italic text-blue-900">{data.selectedJobOption || '___________'}</span> in the <span className="font-bold italic text-blue-900">{data.field || '_____________'}</span> field in the city/region of <span className="font-bold italic text-blue-900">{data.location || '_____________'}</span>. I would like to apply to jobs with <span className="font-bold italic text-blue-900">{data.company || '______________________'}</span> because <span className="font-bold italic text-blue-900">{data.reason || '____________________'}</span>.
                  </p>
                </div>

                <div className="mt-24 space-y-4">
                  <div className="border-t border-gray-200 pt-8 flex flex-col items-start gap-4">
                    <div className="h-16">
                      {data.signatureData ? (
                        <img src={data.signatureData} alt="Signature" className="h-16 w-auto" />
                      ) : (
                        <div className="h-16 w-48 border-b border-gray-300 flex items-center justify-center text-xs text-gray-300">Sign in Planner</div>
                      )}
                    </div>
                    
                    {/* Smart Chip Date */}
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 text-sm font-semibold shadow-sm w-fit print:border-none print:bg-transparent print:p-0">
                      <Calendar size={14} className="print:hidden" />
                      <span>{data.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Footer name={`${data.firstName} ${data.lastName}`} />
            </div>

          </div>
        )}
      </main>

      {/* Persistence Controls */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-50 flex items-center justify-center gap-6 shadow-2xl print:hidden">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Settings size={16} />
          <span>Margins: <span className="font-bold">1 inch</span></span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Monitor size={16} />
          <span className="font-mono">Employment_Plan_{data.firstName}_{data.lastName}</span>
        </div>
      </div>
    </div>
  );
};

// UI Components for the Document Layout
const Header: React.FC<{ pageNum: number }> = ({ pageNum }) => (
  <div className="absolute top-8 left-[1in] right-[1in] flex justify-between items-center text-xs text-gray-400 font-sans border-b border-gray-50 pb-2 print:top-4">
    <span className="font-medium tracking-wider">Page {pageNum}</span>
    <span className="uppercase text-[10px]">Employment Plan Builder</span>
  </div>
);

const Footer: React.FC<{ name: string }> = ({ name }) => (
  <div className="absolute bottom-8 left-[1in] right-[1in] flex justify-center text-xs text-gray-400 font-sans border-t border-gray-50 pt-2 print:bottom-4">
    <span className="font-medium">{name}</span>
  </div>
);

export default App;
