# 🦁 3D Zoo Adventure Game

A beautiful 3D zoo simulation game built with Three.js that lets you explore a virtual zoo environment with interactive animals and dynamic lighting.

## 🌟 Features

### 🎮 Interactive 3D Environment
- **Realistic 3D Graphics**: Built with Three.js for smooth, high-quality 3D rendering
- **Dynamic Lighting**: Day/night cycle with realistic sun and moon lighting
- **Environmental Elements**: Trees, rocks, and a water pond for immersive atmosphere
- **Fog Effects**: Atmospheric fog that changes with day/night cycle

### 🦒 Animal Life
- **5 Different Animal Types**: Lions, Elephants, Giraffes, Zebras, and Monkeys
- **Animated Movement**: Animals move around the environment with realistic behaviors
- **Interactive Selection**: Click on any animal to learn detailed information
- **Educational Content**: Each animal comes with habitat and diet information

### 🎯 Game Controls
- **Camera Controls**: 
  - Mouse: Rotate view around the zoo
  - Scroll: Zoom in/out
  - Right-click: Pan the camera
- **UI Controls**:
  - Reset Camera: Return to default view
  - Toggle Animations: Pause/resume animal movements
  - Day/Night Toggle: Switch between day and night lighting

### 📊 Real-time Statistics
- **Animal Counter**: Shows total number of animals in the zoo
- **Visitor Counter**: Simulated visitor count that updates dynamically
- **Animal Information Panel**: Detailed facts about selected animals

## 🚀 How to Run

1. **Download/Clone** the project files
2. **Open** `index.html` in a modern web browser
3. **Wait** for the loading screen to complete
4. **Start exploring** the 3D zoo!

### Browser Requirements
- Modern web browser with WebGL support
- Chrome, Firefox, Safari, or Edge (latest versions recommended)
- JavaScript enabled

## 🎨 Technical Details

### Built With
- **Three.js**: 3D graphics library
- **HTML5/CSS3**: Modern web standards
- **Vanilla JavaScript**: No frameworks required

### Performance Features
- **Optimized Rendering**: Efficient 3D scene management
- **Shadow Mapping**: Realistic shadows for all objects
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: 60fps performance with requestAnimationFrame

## 🎮 Game Mechanics

### Animal Behaviors
- **Random Movement**: Animals change direction every 3 seconds
- **Boundary Awareness**: Animals stay within the zoo boundaries
- **Realistic Physics**: Animals have different speeds and sizes
- **Bobbing Motion**: Subtle up/down movement for lifelike appearance

### Environmental Features
- **15 Trees**: Randomly placed throughout the environment
- **8 Rocks**: Various sizes and orientations
- **Water Pond**: Transparent blue pond with realistic appearance
- **Dynamic Lighting**: Sun and moon lights with proper shadows

## 📱 Responsive Design

The game adapts to different screen sizes:
- **Desktop**: Full feature set with sidebar controls
- **Tablet**: Optimized layout with adjusted UI elements
- **Mobile**: Simplified controls for touch interaction

## 🔧 Customization

You can easily modify the game by editing the JavaScript file:
- **Add New Animals**: Modify the `animalTypes` array in `createAnimals()`
- **Change Environment**: Adjust tree, rock, and pond placement
- **Modify Lighting**: Customize day/night cycle colors and intensity
- **Add New Features**: Extend the game with additional interactive elements

## 🎯 Educational Value

Perfect for:
- **Children**: Learn about different animals and their habitats
- **Students**: Understand 3D graphics and game development
- **Developers**: Study Three.js implementation and 3D web development

## 📄 File Structure

```
3D-Zoo-Game/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── game.js            # Main game logic and Three.js implementation
└── README.md          # This documentation file
```

## 🐛 Troubleshooting

### Common Issues
1. **Game won't load**: Ensure JavaScript is enabled in your browser
2. **Poor performance**: Try closing other browser tabs or applications
3. **Controls not working**: Make sure you're clicking on the 3D canvas area
4. **Animals not moving**: Check if animations are enabled in the controls panel

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎉 Enjoy Your Zoo Adventure!

Explore the 3D environment, interact with the animals, and learn about wildlife in this immersive zoo simulation. The game combines education with entertainment, making it perfect for all ages!

---

*Built with ❤️ using Three.js and modern web technologies*

