export function moveInDom(e, d) {
  const divRect = d.getBoundingClientRect()
  if (e.clientX >= divRect.left && e.clientX <= divRect.right &&
    e.clientY >= divRect.top && e.clientY <= divRect.bottom) {
    return true      
  }
  return false
}
