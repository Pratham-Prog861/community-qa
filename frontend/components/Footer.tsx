import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
  <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
    <p>© {new Date().getFullYear()} Community Q&A. All rights reserved.</p>
    <div className="flex items-center gap-4">
      <a className="hover:text-slate-200" href="https://github.com/pratham-prog861/community-qa" target="_blank" rel="noreferrer">
        GitHub
      </a>
      <a className="hover:text-slate-200" href="/privacy">
        Privacy
      </a>
      <a className="hover:text-slate-200" href="/terms">
        Terms
      </a>
    </div>
  </div>
</footer>
  )
}

export default Footer