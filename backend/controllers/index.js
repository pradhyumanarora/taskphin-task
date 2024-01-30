const pool = require("../queries");
const bcrypt = require("bcrypt");

const welcome = async (req, res) => {
    res.status(200).json({ message: "Welcome to the backend" });
};

const addCandidate = async (req, res) => {
    const { name, email, phone, qualifications, status, expected_salary, userSkills } = req.body;

    try {
        // Create candidate table if not exists
        await pool.query(`CREATE TABLE IF NOT EXISTS candidate (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            expected_salary DECIMAL(10, 2),
            status VARCHAR(50)
        )`);

        // Validation
        if (!name || !email || !phone || !status || !expected_salary) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Check if candidate with the same email already exists
        const existingCandidate = await pool.query(`SELECT * FROM candidate WHERE email = $1`, [email]);
        if (existingCandidate.rows.length > 0) {
            return res.status(400).json({ message: "Candidate already exists" });
        }

        // Insert candidate data
        const newCandidate = await pool.query(
            `INSERT INTO candidate (name, email, phone, expected_salary, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [name, email, phone, expected_salary, status]
        );

        const candidateId = newCandidate.rows[0].id;

        // Create cand_qual table if not exists
        await pool.query(`
    CREATE TABLE IF NOT EXISTS cand_qual (
        id SERIAL PRIMARY KEY,
        candidate_id INTEGER,
        degree VARCHAR(255) NOT NULL,
        spec VARCHAR(255),
        college VARCHAR(255) NOT NULL,
        cgpa_percent DECIMAL(5, 2) NOT NULL,
        yop INTEGER NOT NULL,
        FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
        UNIQUE (candidate_id, degree)
    );
`);


        // Insert qualification data into cand_qual table
        for (const qualification of qualifications) {
            await pool.query(
                `INSERT INTO cand_qual (candidate_id, degree, spec, college, cgpa_percent, yop) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [candidateId, qualification.title, qualification.spec, qualification.college, qualification.cgpa_percent, qualification.yop]
            );
        }

        // Create user_skill table if not exists
        await pool.query(`CREATE TABLE IF NOT EXISTS user_skill (
            id SERIAL PRIMARY KEY,
            candidate_id INTEGER,
            skill_name VARCHAR(255) NOT NULL,
            experience INTEGER NOT NULL,
            FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
            UNIQUE (candidate_id, skill_name)
        )`);

        // Insert user skills data into user_skill table
        for (const [skillName, experience] of Object.entries(userSkills)) {
            let experienceValue;

            if (experience.toLowerCase() === "lessthan1year") {
                experienceValue = 1;
            } else if (experience.toLowerCase() === "1-2years") {
                experienceValue = 2;
            } else {
                experienceValue = 3;
            }

            await pool.query(
                `INSERT INTO user_skill (candidate_id, skill_name, experience) VALUES ($1, $2, $3)`,
                [candidateId, skillName, experienceValue]
            );
        }

        res.status(200).json({ message: "Candidate added successfully", candidateId: candidateId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


getAllCandidate = async (req, res) => {
    try {
        const candidates = await pool.query(`SELECT * FROM candidate`);

        if (candidates.rows.length === 0) {
            return res.status(400).json({ message: "No candidate found" });
        }
        const candidateIds = candidates.rows.map(candidate => candidate.id);

        const skillsResult = await pool.query(`
            SELECT * FROM user_skill
            WHERE candidate_id = ANY($1::int[])
        `, [candidateIds]);
        const qualifications = await pool.query(`
            SELECT * FROM cand_qual
            WHERE candidate_id = ANY($1::int[])
        `, [candidateIds]);
        const allCandidate = candidates.rows.map(candidate => {
            const candidateSkills = skillsResult.rows
                .filter(skill => skill.candidate_id === candidate.id)
                .reduce((acc, skill) => {
                    const skillName = skill.skill_name;
                    const experience = skill.experience; // Assuming there is an 'experience' column in your user_skill table
                    acc[skillName] = experience;
                    return acc;
                }, {});
            const candidateQualifications = qualifications.rows
                .filter(qualification => qualification.candidate_id === candidate.id)
                .map(qualification => ({
                    degree: qualification.degree,
                    spec: qualification.spec,
                    college: qualification.college,
                    cgpa_percent: qualification.cgpa_percent,
                    yop: qualification.yop
                }));

            return {
                id: candidate.id,
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                expected_salary: candidate.expected_salary,
                status: candidate.status,
                skills: candidateSkills,
                qualifications: candidateQualifications
            };
        });

        res.status(200).json({ allCandidate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getCandidateById = async (req, res) => {
    try {
        const candidateId = req.params.id; // Assuming the candidate ID is passed in the request parameters

        const candidate = await pool.query(`
            SELECT * FROM candidate
            WHERE id = $1
        `, [candidateId]);

        if (candidate.rows.length === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const skillsResult = await pool.query(`
            SELECT * FROM user_skill
            WHERE candidate_id = $1
        `, [candidateId]);
        const qualifications = await pool.query(`
            SELECT * FROM cand_qual
            WHERE candidate_id = $1
        `, [candidateId]);

        const candidateSkills = skillsResult.rows.reduce((acc, skill) => {
            const skillName = skill.skill_name;
            const experience = skill.experience; // Assuming there is an 'experience' column in your user_skill table
            acc[skillName] = experience;
            return acc;
        }, {});

        const candidateQualifications = qualifications.rows.map(qualification => ({
            degree: qualification.degree,
            spec: qualification.spec,
            college: qualification.college,
            cgpa_percent: qualification.cgpa_percent,
            yop: qualification.yop
        }));

        const resultCandidate = {
            id: candidate.rows[0].id,
            name: candidate.rows[0].name,
            email: candidate.rows[0].email,
            phone: candidate.rows[0].phone,
            expected_salary: candidate.rows[0].expected_salary,
            status: candidate.rows[0].status,
            skills: candidateSkills,
            qualifications: candidateQualifications
        };

        res.status(200).json({ candidate: resultCandidate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, skills, qualifications, status, expected_salary } = req.body;

    try {
        // Check if the candidate exists
        const candidateCheck = await pool.query(`SELECT * FROM candidate WHERE id = $1`, [id]);
        if (candidateCheck.rows.length === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Update candidate details
        const updateCandidateQuery = await pool.query(`
            UPDATE candidate 
            SET name = $1, email = $2, phone = $3, expected_salary = $4, status = $5
            WHERE id = $6
        `, [name, email, phone, expected_salary, status, id]);

        // Update skills (assuming skills is an array of objects with name and experience)
        if (skills) {
            await Promise.all(Object.entries(skills).map(async ([skillName, experience]) => {
                await pool.query(`
                UPDATE user_skill
                SET experience = $3
                WHERE candidate_id = $1 AND skill_name = $2
                `, [id, skillName, experience]);
            }));
        }

        // Update qualifications (assuming qualification is an object with degree, spec, college, cgpa_percent, yop)
        if (qualifications && qualifications.length > 0) {
            await Promise.all(qualifications.map(async qualification => {
                await pool.query(`
                UPDATE cand_qual
                SET spec = $3, college = $4, cgpa_percent = $5, yop = $6
                WHERE candidate_id = $1 AND degree = $2
`, [id, qualification.degree, qualification.spec, qualification.college, qualification.cgpa_percent, qualification.yop]);

            }));
        }

        res.status(200).json({ message: "Candidate updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const deleteCandidate = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await pool.query(`SELECT * FROM candidate WHERE id = $1`, [id]);
        if (candidate.rows.length === 0) {
            return res.status(400).json({ message: "No candidate found" });
        }
        const deleteCandidate = await pool.query(`DELETE FROM candidate WHERE id = $1`, [id]);
        res.status(200).json({ message: "Candidate deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const addSkill = async (req, res) => {
    const { skill } = req.body;
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            skill VARCHAR(255) NOT NULL
        )`);
        if (!skill) {
            return res.status(400).json({ message: "Please add skill Name" });
        }
        const ifExixts = await pool.query(`SELECT * FROM skills WHERE skill = $1`, [skill]);
        if (ifExixts.rows.length > 0) {
            return res.status(400).json({ message: "Skill already exists" });
        }

        const newSkill = await pool.query(`INSERT INTO skills (skill) VALUES ($1) RETURNING *`, [skill]);
        res.status(200).json({ message: "Skill added successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

getAllSkills = async (req, res) => {
    try {
        const allSkills = await pool.query(`SELECT * FROM skills`);
        if (allSkills.rows.length === 0) {
            return res.status(400).json({ message: "No skill found" });
        }
        res.status(200).json({ allSkills: allSkills.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

getSkillById = async (req, res) => {
    const { id } = req.params;
    try {
        const skill = await pool.query(`SELECT * FROM skills WHERE id = $1`, [id]);
        if (skill.rows.length === 0) {
            return res.status(400).json({ message: "No skill found" });
        }
        res.status(200).json({ skill: skill.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

addQualification = async (req, res) => {
    const { qualification } = req.body;
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS qualification (
            id SERIAL PRIMARY KEY,
            qualification VARCHAR(255) NOT NULL
        )`);
        if (!qualification) {
            return res.status(400).json({ message: "Please add qualification Name" });
        }
        const ifExixts = await pool.query(`SELECT * FROM qualification WHERE qualification = $1`, [qualification]);
        if (ifExixts.rows.length > 0) {
            return res.status(400).json({ message: "Qualification already exists" });
        }

        const newQualification = await pool.query(`INSERT INTO qualification (qualification) VALUES ($1) RETURNING *`, [qualification]);
        res.status(200).json({ message: "Qualification added successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

getAllQualifications = async (req, res) => {
    try {
        const allQualifications = await pool.query(`SELECT * FROM qualification`);
        if (allQualifications.rows.length === 0) {
            return res.status(400).json({ message: "No qualification found" });
        }
        res.status(200).json({ allQualifications: allQualifications.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

getQualificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const qualification = await pool.query(`SELECT * FROM qualification WHERE id = $1`, [id]);
        if (qualification.rows.length === 0) {
            return res.status(400).json({ message: "No qualification found" });
        }
        res.status(200).json({ qualification: qualification.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    welcome,
    addCandidate,
    getAllCandidate,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    addSkill,
    getAllSkills,
    getSkillById,
    addQualification,
    getAllQualifications,
    getQualificationById
}
