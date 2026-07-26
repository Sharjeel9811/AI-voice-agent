import React from 'react'
import { motion } from 'motion/react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import AgentPreview from '../Components/AgentPreview'
import Steps from '../Components/Steps'
import Footer from '../Components/Footer'
import { MdPalette, MdDevices, MdFlashOn } from 'react-icons/md'

const highlights = [
  { icon: <MdPalette size={18} />, title: '4 Themes', desc: 'Dark, Light, Glass & Neon' },
  { icon: <MdDevices size={18} />, title: 'Responsive', desc: 'Looks great on any device' },
  { icon: <MdFlashOn size={18} />, title: 'Real-time', desc: 'Changes apply instantly' },
]

const Home = ({user,setuser}) => {
  return (
    <div>
 <Navbar user={user} setuser={setuser}/>
 <Hero user={user} />

 {/* Agent Preview Section */}
 <section
   className="relative overflow-hidden"
   style={{ background: 'linear-gradient(180deg, #12121F 0%, #0B0B14 50%, #12121F 100%)' }}
 >
   {/* Subtle background glow */}
   <div className="absolute inset-0 pointer-events-none">
     <div
       className="absolute w-[400px] h-[400px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
       style={{ background: 'radial-gradient(circle, #7C5CFC, transparent 70%)' }}
     />
   </div>

   <div className="relative max-w-6xl mx-auto px-6 py-24">
     {/* Section header */}
     <div className="text-center mb-14">
       <motion.div
         initial={{ opacity: 0, y: 12 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
       >
         <p
           className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4"
           style={{ color: '#7C5CFC' }}
         >
           Customizable Themes
         </p>
         <h2
           className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
           style={{ color: '#fff' }}
         >
           Your Brand,{' '}
           <span
             style={{
               background: 'linear-gradient(135deg, #7C5CFC, #00D4FF)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
             }}
           >
             Your Style
           </span>
         </h2>
         <p
           className="text-sm max-w-md mx-auto leading-relaxed"
           style={{ color: 'rgba(255,255,255,0.45)' }}
         >
           Pick a theme that matches your brand identity. Every detail is
           designed to give your customers a seamless experience.
         </p>
       </motion.div>
     </div>

     {/* Content grid */}
     <div className="flex flex-col lg:flex-row items-center gap-14">
       {/* Left - highlights */}
       <motion.div
         initial={{ opacity: 0, x: -20 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: 0.1 }}
         className="flex-1 space-y-6"
       >
         {highlights.map((item, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, x: -12 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
             className="flex items-start gap-4 p-4 rounded-xl transition-all"
             style={{
               background: 'rgba(255,255,255,0.02)',
               border: '1px solid rgba(255,255,255,0.05)',
             }}
           >
             <div
               className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
               style={{ background: 'rgba(124,92,252,0.1)', color: '#7C5CFC' }}
             >
               {item.icon}
             </div>
             <div>
               <p className="text-sm font-semibold mb-0.5" style={{ color: '#fff' }}>
                 {item.title}
               </p>
               <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                 {item.desc}
               </p>
             </div>
           </motion.div>
         ))}
       </motion.div>

       {/* Right - Agent Preview */}
       <motion.div
         initial={{ opacity: 0, x: 20 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="w-full lg:w-[420px] shrink-0"
       >
         <AgentPreview user={user} setuser={setuser} />
       </motion.div>
     </div>
   </div>
 </section>

 {/* Steps Section */}
 <Steps />

 {/* Footer */}
 <Footer />
    </div>
  )
}

export default Home