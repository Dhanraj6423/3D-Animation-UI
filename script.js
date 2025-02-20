document.addEventListener("DOMContentLoaded", () => {
  const beeModel = document.getElementById("bee-model");
  const sections = Array.from(document.querySelectorAll("section"));

  // Movement positions in pixels (X for left-right, Y for up-down)
  const shiftPositionsX = [0, -350, 0, 450]; // Move left (-100px) in About, right (100px) in Contact
  const shiftPositionsY = [0, -20, 0, 25]; // Moves up/down (can be fine-tuned)

  // Different camera orbits per section
  const cameraOrbits = [
    [90, 90], // Home
    [-45, 90], // About (Shift left)
    [-180, 0], // Gallery (Centered)
    [45, 90], // Contact (Shift right)
  ];

  const getSectionOffsets = () =>
    sections.map(
      (section) => section.getBoundingClientRect().top + window.scrollY
    );

  const interpolate = (start, end, progress) =>
    start + (end - start) * progress;

  const getScrollProgress = (scrollY, sectionOffsets) => {
    for (let i = 0; i < sectionOffsets.length - 1; i++) {
      if (scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i + 1]) {
        return (
          i +
          (scrollY - sectionOffsets[i]) /
            (sectionOffsets[i + 1] - sectionOffsets[i])
        );
      }
    }
    return sectionOffsets.length - 1;
  };

  window.addEventListener("scroll", () => {
    const sectionOffsets = getSectionOffsets();
    const scrollProgress = getScrollProgress(window.scrollY, sectionOffsets);
    const sectionIndex = Math.floor(scrollProgress);
    const sectionProgress = scrollProgress - sectionIndex;

    const currentShiftX = interpolate(
      shiftPositionsX[sectionIndex],
      shiftPositionsX[sectionIndex + 1] ?? shiftPositionsX[sectionIndex],
      sectionProgress
    );

    const currentShiftY = interpolate(
      shiftPositionsY[sectionIndex],
      shiftPositionsY[sectionIndex + 1] ?? shiftPositionsY[sectionIndex],
      sectionProgress
    );

    const currentOrbit = cameraOrbits[sectionIndex].map((val, i) =>
      interpolate(
        val,
        cameraOrbits[sectionIndex + 1]?.[i] ?? val,
        sectionProgress
      )
    );

    console.log(`Shift X: ${currentShiftX}, Shift Y: ${currentShiftY}`);
    console.log(`Camera Orbit: ${currentOrbit}`);

    // Move the bee model using absolute positioning (left-right)
    beeModel.style.left = `calc(50% + ${currentShiftX}px)`;
    beeModel.style.top = `calc(50% + ${currentShiftY}px)`;

    // Update the camera orbit
    beeModel.setAttribute(
      "camera-orbit",
      `${currentOrbit[0]}deg ${currentOrbit[1]}deg`
    );
  });
});
