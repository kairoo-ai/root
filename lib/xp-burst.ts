// Triggers an Anime.js XP particle burst at a given DOM element
// Called when user completes a goal

export async function triggerXpBurst(anchorEl: HTMLElement, xp: number) {
  const { animate } = await import('animejs')

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden'
  document.body.appendChild(container)

  const rect = anchorEl.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const PARTICLE_COUNT = 12
  const particles: HTMLElement[] = []

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div')
    p.textContent = i < 3 ? `+${xp}XP` : '✦'
    p.style.cssText = `
      position:absolute;
      left:${cx}px;
      top:${cy}px;
      font-size:${i < 3 ? '11px' : '8px'};
      font-weight:800;
      color:${i < 3 ? '#14b8a6' : '#f59e0b'};
      opacity:0;
      transform:translate(-50%,-50%);
      pointer-events:none;
      user-select:none;
      white-space:nowrap;
    `
    container.appendChild(p)
    particles.push(p)
  }

  const angle = (360 / PARTICLE_COUNT)
  particles.forEach((p, i) => {
    const rad = ((angle * i) - 90) * (Math.PI / 180)
    const dist = 60 + Math.random() * 40
    animate(p, {
      translateX: [0, Math.cos(rad) * dist],
      translateY: [0, Math.sin(rad) * dist],
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0],
      duration: 800 + Math.random() * 300,
      easing: 'easeOutExpo',
      delay: Math.random() * 100,
    })
  })

  setTimeout(() => {
    document.body.removeChild(container)
  }, 1300)
}
