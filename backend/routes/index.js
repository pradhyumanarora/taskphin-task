const {Router} = require('express');
const router = Router();
const controller = require('../controllers')

router.get('/',controller.welcome);
router.post('/addCandidate', controller.addCandidate);
router.post('/addSkill', controller.addSkill);
router.post('/addQualification', controller.addQualification);
router.get('/candidates', controller.getAllCandidate);
router.get('/candidates/:id', controller.getCandidateById);
router.put('/candidates/:id', controller.updateCandidate);
router.delete('/candidates/:id', controller.deleteCandidate);
router.get('/skills', controller.getAllSkills);
router.get('/skills/:id', controller.getSkillById);
router.get('/qualifications', controller.getAllQualifications);
router.get('/qualifications/:id', controller.getQualificationById);


module.exports = router;