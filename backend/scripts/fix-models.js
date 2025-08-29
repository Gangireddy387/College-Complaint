const fs = require('fs');
const path = require('path');

// Get all model files
const modelsDir = path.join(__dirname, '..', 'models');
const modelFiles = fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js') && file !== 'index.js');

// Fix each model file
modelFiles.forEach(file => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace incorrect sequelize import
  content = content.replace(
    /const sequelize = require\(['"]\.\.\/config\/database['"]\);/,
    'const { sequelize } = require(\'../config/database\');'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
