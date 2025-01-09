export default function transitionControl(page) {
  document.getElementById("homepage").classList.toggle("transition");
  document.getElementById(`${page}`).classList.toggle("transition");
}
