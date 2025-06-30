import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";

const ResultsPage = ({ analysisResult, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 70) return "Strong Match";
    if (percentage >= 50) return "Moderate Match";
    return "Weak Match";
  };

  const getStatusIcon = (status) => {
    if (status.includes("Full match") || status.includes("Exact match"))
      return "✅";
    if (status.includes("Partial match")) return "⚠️";
    if (status.includes("No match") || status.includes("Different"))
      return "❌";
    return "⚠️";
  };

  // Extract key skills from analysis result
  const getKeySkills = () => {
    if (!analysisResult?.key_skills && !analysisResult?.skills) {
      return [];
    }

    // Try different possible structures for skills data
    const skills = analysisResult.key_skills || analysisResult.skills || [];

    if (Array.isArray(skills)) {
      return skills.slice(0, 6); // Limit to top 6 skills
    }

    // If skills is an object, convert to array
    if (typeof skills === "object") {
      return Object.entries(skills)
        .map(([name, years]) => ({
          name,
          years: years || "N/A",
        }))
        .slice(0, 6);
    }

    return [];
  };

  // Extract stage-wise analysis from results
  const getStageAnalysis = () => {
    if (!analysisResult?.stage_analysis && !analysisResult?.sections) {
      return [];
    }

    // Try to extract stage-wise data from sections or dedicated stage_analysis
    const stageData = analysisResult.stage_analysis || [];

    if (stageData.length > 0) {
      return stageData;
    }

    // Fallback: create stage analysis from sections data
    const sections = analysisResult.sections || [];
    return sections.slice(0, 4).map((section) => ({
      category: section.section_name?.replace("_", " ") || "Unknown",
      match:
        section.match_percentage >= 70
          ? "Strong"
          : section.match_percentage >= 50
          ? "Partial"
          : "Weak",
      projects: section.project_count || "N/A",
      criticality: section.criticality || "Medium",
    }));
  };

  const keySkills = getKeySkills();
  const stageAnalysis = getStageAnalysis();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Upload New Files
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary */}
          <div className="lg:col-span-1">
            {/* Match Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Match Summary
              </h2>
              {analysisResult.job_title && (
                <div className="text-sm text-gray-600 mb-4">
                  {analysisResult.job_title}
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl font-bold text-green-600">
                  {Math.round(analysisResult.overall_percentage)}%
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-semibold ${getMatchColor(
                      analysisResult.overall_percentage
                    )}`}
                  >
                    {getMatchLabel(analysisResult.overall_percentage)}
                  </div>
                </div>
              </div>

              {/* Key Skills - Only show if data exists */}
              {keySkills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Key Skills
                  </h3>
                  <div className="space-y-3">
                    {keySkills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-purple-50 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-purple-900">
                          {skill.name || skill}
                        </span>
                        {skill.years && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {skill.years} years
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stage Analysis - Only show if data exists */}
            {stageAnalysis.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Match Analysis Overview
                </h3>

                <div className="space-y-3">
                  {stageAnalysis.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.match === "Strong"
                              ? "bg-green-100 text-green-800"
                              : item.match === "Partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.match}
                        </span>
                        {item.projects && (
                          <span className="text-xs text-gray-500">
                            {item.projects} Projects
                          </span>
                        )}
                        {item.criticality && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {item.criticality}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Detailed Analysis */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {analysisResult.sections?.map((section, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg">
                  <div
                    className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleSection(section.section_name)}
                  >
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {section.section_name?.replace("_", " ") ||
                          "Unknown Section"}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-2xl font-bold ${getMatchColor(
                            section.match_percentage
                          )}`}
                        >
                          {Math.round(section.match_percentage)}%
                        </span>
                        {section.section_score !== undefined &&
                          section.total_possible !== undefined && (
                            <span className="text-sm text-gray-500">
                              ({section.section_score}/{section.total_possible})
                            </span>
                          )}
                      </div>
                    </div>
                    {expandedSections[section.section_name] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {expandedSections[section.section_name] && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        {section.match_results?.map((result, resultIndex) => (
                          <div
                            key={resultIndex}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {result.field?.replace("_", " ") ||
                                  "Unknown Field"}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getStatusIcon(result.match_status)}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {result.match_status}
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                  Job Description:
                                </p>
                                <div className="text-sm text-gray-800">
                                  {Array.isArray(result.jd_value) ? (
                                    result.jd_value.length > 0 ? (
                                      <ul className="list-disc list-inside space-y-1">
                                        {result.jd_value.map((item, i) => (
                                          <li key={i}>{item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span className="text-gray-500 italic">
                                        No requirements specified
                                      </span>
                                    )
                                  ) : (
                                    result.jd_value || (
                                      <span className="text-gray-500 italic">
                                        No requirements
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                  Resume:
                                </p>
                                <div className="text-sm text-gray-800">
                                  {Array.isArray(result.resume_value) ? (
                                    result.resume_value.length > 0 ? (
                                      <ul className="list-disc list-inside space-y-1">
                                        {result.resume_value.map((item, i) => (
                                          <li key={i}>{item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span className="text-gray-500 italic">
                                        No experience found
                                      </span>
                                    )
                                  ) : (
                                    result.resume_value || (
                                      <span className="text-gray-500 italic">
                                        No experience
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            {result.comments && (
                              <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Comments:</span>{" "}
                                  {result.comments}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )) || (
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <p className="text-gray-500">
                    No detailed analysis data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUploader = () => {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const jdInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "text/plain"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload only PDF or TXT files");
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size should be less than 10MB");
        return;
      }

      setError("");
      if (type === "jd") {
        setJdFile(file);
      } else {
        setResumeFile(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!jdFile || !resumeFile) {
      setError("Please upload both JD and Resume files");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadStatus("Analyzing files...");

    const formData = new FormData();
    formData.append("jd_file", jdFile);
    formData.append("resume_file", resumeFile);

    try {
      const response = await fetch(
        "http://3.110.84.51:8000/analyze-comprehensive",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setUploadStatus("Analysis completed successfully!");
    } catch (err) {
      setError(`Failed to analyze files: ${err.message}`);
      setUploadStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setJdFile(null);
    setResumeFile(null);
    setError("");
    setUploadStatus("");
    setAnalysisResult(null);
    if (jdInputRef.current) jdInputRef.current.value = "";
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const FileUploadCard = ({
    title,
    file,
    onFileChange,
    inputRef,
    icon: Icon,
    accept,
  }) => (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 p-8">
      <div className="text-center">
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

        {file ? (
          <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              {file.name}
            </span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Upload PDF or TXT file (max 10MB)
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </div>
  );

  if (analysisResult) {
    return <ResultsPage analysisResult={analysisResult} onReset={reset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JD Resume Match Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Job Description and Resume to get comprehensive matching
            analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Upload Files
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <FileUploadCard
              title="Job Description"
              file={jdFile}
              onFileChange={(e) => handleFileChange(e, "jd")}
              inputRef={jdInputRef}
              icon={FileText}
              accept=".pdf,.txt"
            />

            <FileUploadCard
              title="Resume"
              file={resumeFile}
              onFileChange={(e) => handleFileChange(e, "resume")}
              inputRef={resumeInputRef}
              icon={User}
              accept=".pdf,.txt"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Status Message */}
          {uploadStatus && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700">{uploadStatus}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={reset}
              disabled={isUploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Reset
            </button>

            <button
              onClick={handleSubmit}
              disabled={!jdFile || !resumeFile || isUploading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Analyze Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">File Support</h3>
            <p className="text-sm text-gray-600">
              Supports PDF and TXT formats up to 10MB
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Comprehensive Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Detailed matching across multiple criteria
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Instant Results
            </h3>
            <p className="text-sm text-gray-600">
              Get your analysis results immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
