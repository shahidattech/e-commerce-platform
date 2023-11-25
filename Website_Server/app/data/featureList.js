var availableFeatures = function () {
    return {
        //Class features
        ReadClass: 'Class.Read',
        WriteClass:'Class.Write',
        //CreateClass: 'Class.CreateClass', write
        //RemoveClass: 'Class.RemoveClass', write
        //UpdateClassSummary: 'Class.UpdateClassSummary', write
        //UpdateClassDescription: 'Class.UpdateClassDescription', write
       // Updateclassfaq: 'Class.Updateclassfaq', write
        //GetAllClasses: 'Class.GetAllClasses', read
        //GetClassDetails: 'Class.GetClassDetails',    read    
        //CreateForumCat: 'Class.CreateForumCat', write
        //RemoveForumCat: 'Class.RemoveForumCat',  write
        //GetClassForumCats: 'Class.GetClassForumCats', read
        //CreateNotice: 'Class.CreateNotice', write
        //RemoveNotice: 'Class.RemoveNotice', write
        //AssignTest: 'Class.AssignTest', write
        //GetAssignTests: 'Class.GetAssignTests', read
        GetStudentTestParticipation: 'Class.GetStudentTestParticipation',
        //EditStudentTestParticipation: 'Class.EditStudentTestParticipation',  write
        //RemoveAssigedTest: 'Class.RemoveAssigedTest', write
        GetAllClassStudents: 'Class.GetAllClassStudents', 
        //RemoveClasssStudent: 'Class.RemoveClasssStudent',  write
        GetStudentClassDetails: 'Class.GetStudentClassDetails',
        Registerclass: 'Class.RegisterClass',
        //GetNotices: 'Class.GetNotices',  read
        //AllClasseNames: 'Class.AllClasseNames',        read
        //CreateResource: 'Class.CreateResource',       write
        //RemoveResource: 'Class.RemoveResource',    write
        //AccessResource: 'Class.AccessResource',  read
        //Resource features
        WriteResource: 'Resource.Write',
        ReadResource: 'Resource.Read',
        //Test features
        ReadTest: 'Test.Read',
        WriteTest:'Test.Write',
        //CreateTest: 'Test.CreateTest',  write
        //SaveTestEvaluation: 'Test.SaveTestEvaluation', write
        //GetTest: 'Test.GetTest', read
        GetTestAnswer: 'Test.GetTestAnswer',
        //GetTests: 'Test.GetTests',  read
        SaveTest: 'Test.SaveTest',
        //GetTestResult: 'Test.GetTestResult',  read
        //Forum features
        WriteForum: 'Forum.Write',
        ReadForum:'Read.Forum',
        PaymentWrite: 'Payment.Write'
        //WriteThread: 'ClassForum.WriteThread', write
        //ReadThread: 'ClassForum.ReadThread',   read
        //WriteComment: 'ClassForum.WriteComment',   write
        //ReadComment: 'ClassForum.ReadComment'      read
    };
};


exports.availableFeatures = availableFeatures;