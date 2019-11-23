class Student {
    constructor(name, email, community) {
        this.name = name;
        this.email = email;
        this.community = community;
    }
}

class Bootcamp {
    constructor(name, level, students = []) {
        this.name = name;
        this.level = level;
        this.students = students;
    }

    registerStudent(student){
        if (this.students.filter(student => student.email === student.email).length){
            console.log(`The email ${student.email} is already registered`);
        } else{
            this.students.push(student);
            console.log(`Registering ${student.email} to the bootcamp Web Dev Fundamentals`);
            return this.students;
        }
    }
}

const neo = new Student ("Neo", "neo@matrix", "Seattle");
const webdev = new Bootcamp ("Web Development", "expert");