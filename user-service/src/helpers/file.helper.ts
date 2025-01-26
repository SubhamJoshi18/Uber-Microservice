import fs from 'fs'
import path from 'path'

class FileHelper {  

        checkIfPathExists = (filePath : string) : object => {
            const isValidpath = typeof filePath === 'string' && filePath.length > 0
            if(!isValidpath){
                return {
                    message : `The File Path is`
                }
            }
            return {
                pathStatus : fs.existsSync(filePath as string)
            }
        }

     
        createS3BucketFolder = (filePath : string) => {
            const status =  filePath.includes('S3Bucket') ? fs.mkdirSync(filePath,{recursive:true}) : null
            return status
        }

        getS3BucketPrefix = () => {
            return path.join(process.cwd(),'S3Bucket')
        }

        createBucketPrefix = () => {
            return  path.join('S3Bucket');
        }

        deleteS3BucketPrefix = (filePath : string) => {
            return this.checkIfPathExists(filePath) ?  fs.unlinkSync(filePath) : null
        }

        listFolder = (filePath : string) => {
            console.log(filePath)
            const isDir = fs.readdirSync(filePath)
            return isDir
        }

        createPath  = (filename:string) => {
            if(filename.includes('uploads')){
                const [folderName,fileName] = filename.split('/')
                return path.join(process.cwd(),folderName,fileName)
            }
            return path.join(process.cwd(),filename)
           
        }


        copyUploadToS3Bucket = (originalPath: string, copyPath: string) => {
            const photoUrl = path.basename(originalPath);
            const concatUrl = path.join(copyPath, photoUrl);
        
        
            const existsOriginal = this.checkIfPathExists(originalPath);
            const existsCopy = this.checkIfPathExists(copyPath);
        
            if (existsOriginal) {
           
                if (!existsCopy) {
                    fs.mkdirSync(copyPath, { recursive: true });
                }
          
                fs.copyFileSync(originalPath, concatUrl);
                return `File copied to ${concatUrl}`;
            } else {
                return `Original file does not exist: ${originalPath}`;
            }
        };

}

export default FileHelper