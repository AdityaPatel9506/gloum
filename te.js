const fs = require('fs');
const path = require('path');

// Construct the relative path to the uploads directory
const fileName = 'sectionImages-1726930021827-911164736.jpg'; // Use the actual file name
const filePath = path.join(__dirname, './uploads', fileName);
console.log(filePath);


// Check if the file exists
if (fs.existsSync(filePath)) {
    // File exists, attempt to delete
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting old section image:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
} else {
    console.log('File not found, skipping deletion');
}
