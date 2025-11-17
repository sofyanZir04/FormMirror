'use client'

import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, Target, Zap } from 'lucide-react'

type InsightsProps = {
  insights: {
    killerField: {
      fieldName: string
      visits: number
      abandons: number
      abandonmentRate: number
      severity: 'critical' | 'high' | 'medium' | 'low'
    } | null
    aiInsights: {
      summary: string
      criticalIssues: Array<{
        issue: string
        impact: string
        recommendation: string
        priority: 'high' | 'medium' | 'low'
      }>
      opportunities: Array<{
        title: string
        description: string
        expectedImpact: string
      }>
      userBehaviorPatterns: Array<{
        pattern: string
        insight: string
      }>
      nextSteps: string[]
    }
    stats: {
      totalEvents: number
      uniqueSessions: number
      submits: number
      abandons: number
      avgSessionDuration: number
      completionRate: number
      bounceRate: number
    }
    fieldMetrics: Array<{
      fieldName: string
      visits: number
      abandons: number
      abandonmentRate: number
      avgDuration: number
      hesitationScore: number
    }>
  }
}

export default function EnhancedInsights({ insights }: InsightsProps) {
  const { killerField, aiInsights, stats, fieldMetrics } = insights

  // Detect if using fallback (heuristic: if summary mentions exact session count and completion rate with specific format)
  const isUsingFallback = aiInsights.summary.includes('sessions with a') && aiInsights.summary.includes('% completion rate over')

  const severityColors = {
    critical: 'bg-red-500/10 border-red-500/30 text-red-400',
    high: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    low: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }

  const priorityBadges = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  }

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-black text-white">AI Analysis</h3>
              {isUsingFallback && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                  Rule-based
                </span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed">{aiInsights.summary}</p>
            {isUsingFallback && (
              <p className="text-xs text-gray-400 mt-2">
                💡 Using smart rule-based insights. AI analysis will return when rate limits reset.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Killer Field Alert */}
      {killerField && killerField.severity !== 'low' && (
        <div className={`rounded-2xl p-6 border ${severityColors[killerField.severity]}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold uppercase tracking-wide mb-1">
                  {killerField.severity} Priority Field
                </div>
                <div className="text-xl font-black mb-2">{killerField.fieldName}</div>
                <div className="text-sm opacity-90">
                  {killerField.abandons} of {killerField.visits} users abandoned here 
                  ({Math.round(killerField.abandonmentRate * 100)}% drop-off rate)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Issues */}
      {aiInsights.criticalIssues && aiInsights.criticalIssues.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Critical Issues
          </h4>
          <div className="space-y-4">
            {aiInsights.criticalIssues.map((issue, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h5 className="font-bold text-white flex-1">{issue.issue}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold border ${priorityBadges[issue.priority]}`}>
                    {issue.priority}
                  </span>
                </div>
                <div className="text-sm space-y-2">
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Impact:</span> {issue.impact}
                  </div>
                  <div className="text-emerald-300">
                    <span className="font-semibold text-emerald-400">✓ Fix:</span> {issue.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities */}
        {aiInsights.opportunities && aiInsights.opportunities.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Growth Opportunities
            </h4>
            <div className="space-y-3">
              {aiInsights.opportunities.map((opp, idx) => (
                <div key={idx} className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                  <h5 className="font-bold text-emerald-300 mb-2">{opp.title}</h5>
                  <p className="text-sm text-gray-300 mb-2">{opp.description}</p>
                  <div className="text-xs text-emerald-400 font-semibold">
                    💡 {opp.expectedImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Behavior Patterns */}
        {aiInsights.userBehaviorPatterns && aiInsights.userBehaviorPatterns.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-blue-400" />
              Behavior Patterns
            </h4>
            <div className="space-y-3">
              {aiInsights.userBehaviorPatterns.map((pattern, idx) => (
                <div key={idx} className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                  <div className="font-semibold text-blue-300 mb-1 text-sm">{pattern.pattern}</div>
                  <div className="text-sm text-gray-300">{pattern.insight}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {aiInsights.nextSteps && aiInsights.nextSteps.length > 0 && (
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-violet-500/20">
          <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-violet-400" />
            Recommended Next Steps
          </h4>
          <div className="space-y-2">
            {aiInsights.nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field Performance Table */}
      {fieldMetrics && fieldMetrics.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <h4 className="text-lg font-black mb-4 text-white">Field Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-bold text-gray-300">Field</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-300">Visits</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-300">Abandons</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-300">Drop-off %</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-300">Avg Time</th>
                  <th className="text-right py-3 px-2 font-bold text-gray-300">Hesitation</th>
                </tr>
              </thead>
              <tbody>
                {fieldMetrics.slice(0, 10).map((field, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2 font-medium text-white">{field.fieldName}</td>
                    <td className="py-3 px-2 text-right text-gray-300">{field.visits}</td>
                    <td className="py-3 px-2 text-right text-gray-300">{field.abandons}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                        field.abandonmentRate > 0.3 ? 'bg-red-500/20 text-red-300' :
                        field.abandonmentRate > 0.15 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {Math.round(field.abandonmentRate * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-300">{Math.round(field.avgDuration / 1000)}s</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all"
                            style={{ width: `${field.hesitationScore * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{Math.round(field.hesitationScore * 100)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// 'use client'

// import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, Target, Zap } from 'lucide-react'

// type InsightsProps = {
//   insights: {
//     killerField: {
//       fieldName: string
//       visits: number
//       abandons: number
//       abandonmentRate: number
//       severity: 'critical' | 'high' | 'medium' | 'low'
//     } | null
//     aiInsights: {
//       summary: string
//       criticalIssues: Array<{
//         issue: string
//         impact: string
//         recommendation: string
//         priority: 'high' | 'medium' | 'low'
//       }>
//       opportunities: Array<{
//         title: string
//         description: string
//         expectedImpact: string
//       }>
//       userBehaviorPatterns: Array<{
//         pattern: string
//         insight: string
//       }>
//       nextSteps: string[]
//     }
//     stats: {
//       totalEvents: number
//       uniqueSessions: number
//       submits: number
//       abandons: number
//       avgSessionDuration: number
//       completionRate: number
//       bounceRate: number
//     }
//     fieldMetrics: Array<{
//       fieldName: string
//       visits: number
//       abandons: number
//       abandonmentRate: number
//       avgDuration: number
//       hesitationScore: number
//     }>
//   }
// }

// export default function EnhancedInsights({ insights }: InsightsProps) {
//   const { killerField, aiInsights, stats, fieldMetrics } = insights

//   const severityColors = {
//     critical: 'bg-red-500/10 border-red-500/30 text-red-400',
//     high: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
//     medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
//     low: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
//   }

//   const priorityBadges = {
//     high: 'bg-red-500/20 text-red-300 border-red-500/30',
//     medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
//     low: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
//   }

//   return (
//     <div className="space-y-6">
//       {/* AI Summary */}
//       <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
//             <Sparkles className="h-6 w-6 text-white" />
//           </div>
//           <div className="flex-1">
//             <h3 className="text-xl font-black mb-2 text-white">AI Analysis</h3>
//             <p className="text-gray-300 leading-relaxed">{aiInsights.summary}</p>
//           </div>
//         </div>
//       </div>

//       {/* Killer Field Alert */}
//       {killerField && killerField.severity !== 'low' && (
//         <div className={`rounded-2xl p-6 border ${severityColors[killerField.severity]}`}>
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex items-start gap-3">
//               <AlertTriangle className="h-6 w-6 mt-1 flex-shrink-0" />
//               <div>
//                 <div className="text-sm font-bold uppercase tracking-wide mb-1">
//                   {killerField.severity} Priority Field
//                 </div>
//                 <div className="text-xl font-black mb-2">{killerField.fieldName}</div>
//                 <div className="text-sm opacity-90">
//                   {killerField.abandons} of {killerField.visits} users abandoned here 
//                   ({Math.round(killerField.abandonmentRate * 100)}% drop-off rate)
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Critical Issues */}
//       {aiInsights.criticalIssues && aiInsights.criticalIssues.length > 0 && (
//         <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
//           <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
//             <AlertTriangle className="h-5 w-5 text-red-400" />
//             Critical Issues
//           </h4>
//           <div className="space-y-4">
//             {aiInsights.criticalIssues.map((issue, idx) => (
//               <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
//                 <div className="flex items-start justify-between gap-3 mb-3">
//                   <h5 className="font-bold text-white flex-1">{issue.issue}</h5>
//                   <span className={`px-2 py-1 rounded-full text-xs font-bold border ${priorityBadges[issue.priority]}`}>
//                     {issue.priority}
//                   </span>
//                 </div>
//                 <div className="text-sm space-y-2">
//                   <div className="text-gray-300">
//                     <span className="font-semibold text-white">Impact:</span> {issue.impact}
//                   </div>
//                   <div className="text-emerald-300">
//                     <span className="font-semibold text-emerald-400">✓ Fix:</span> {issue.recommendation}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Opportunities */}
//         {aiInsights.opportunities && aiInsights.opportunities.length > 0 && (
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
//             <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
//               <TrendingUp className="h-5 w-5 text-emerald-400" />
//               Growth Opportunities
//             </h4>
//             <div className="space-y-3">
//               {aiInsights.opportunities.map((opp, idx) => (
//                 <div key={idx} className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
//                   <h5 className="font-bold text-emerald-300 mb-2">{opp.title}</h5>
//                   <p className="text-sm text-gray-300 mb-2">{opp.description}</p>
//                   <div className="text-xs text-emerald-400 font-semibold">
//                     💡 {opp.expectedImpact}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* User Behavior Patterns */}
//         {aiInsights.userBehaviorPatterns && aiInsights.userBehaviorPatterns.length > 0 && (
//           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
//             <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
//               <Target className="h-5 w-5 text-blue-400" />
//               Behavior Patterns
//             </h4>
//             <div className="space-y-3">
//               {aiInsights.userBehaviorPatterns.map((pattern, idx) => (
//                 <div key={idx} className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
//                   <div className="font-semibold text-blue-300 mb-1 text-sm">{pattern.pattern}</div>
//                   <div className="text-sm text-gray-300">{pattern.insight}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Next Steps */}
//       {aiInsights.nextSteps && aiInsights.nextSteps.length > 0 && (
//         <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-6 border border-violet-500/20">
//           <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
//             <Zap className="h-5 w-5 text-violet-400" />
//             Recommended Next Steps
//           </h4>
//           <div className="space-y-2">
//             {aiInsights.nextSteps.map((step, idx) => (
//               <div key={idx} className="flex items-start gap-3 text-gray-300">
//                 <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
//                 <span className="text-sm">{step}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Field Performance Table */}
//       {fieldMetrics && fieldMetrics.length > 0 && (
//         <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
//           <h4 className="text-lg font-black mb-4 text-white">Field Performance</h4>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-white/10">
//                   <th className="text-left py-3 px-2 font-bold text-gray-300">Field</th>
//                   <th className="text-right py-3 px-2 font-bold text-gray-300">Visits</th>
//                   <th className="text-right py-3 px-2 font-bold text-gray-300">Abandons</th>
//                   <th className="text-right py-3 px-2 font-bold text-gray-300">Drop-off %</th>
//                   <th className="text-right py-3 px-2 font-bold text-gray-300">Avg Time</th>
//                   <th className="text-right py-3 px-2 font-bold text-gray-300">Hesitation</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fieldMetrics.slice(0, 10).map((field, idx) => (
//                   <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
//                     <td className="py-3 px-2 font-medium text-white">{field.fieldName}</td>
//                     <td className="py-3 px-2 text-right text-gray-300">{field.visits}</td>
//                     <td className="py-3 px-2 text-right text-gray-300">{field.abandons}</td>
//                     <td className="py-3 px-2 text-right">
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
//                         field.abandonmentRate > 0.3 ? 'bg-red-500/20 text-red-300' :
//                         field.abandonmentRate > 0.15 ? 'bg-yellow-500/20 text-yellow-300' :
//                         'bg-green-500/20 text-green-300'
//                       }`}>
//                         {Math.round(field.abandonmentRate * 100)}%
//                       </span>
//                     </td>
//                     <td className="py-3 px-2 text-right text-gray-300">{Math.round(field.avgDuration / 1000)}s</td>
//                     <td className="py-3 px-2 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full bg-yellow-500 rounded-full transition-all"
//                             style={{ width: `${field.hesitationScore * 100}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-gray-400">{Math.round(field.hesitationScore * 100)}</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }