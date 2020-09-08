import { Translation2Android } from '../src/app/Traslation2Android';
import { Translation2iOS } from '../src/app/Translation2iOS';

let example_str1 = "# is good boy";
let expect_str1_android = "%s is good boy";
let expect_str1_ios = "%@ is good boy";

let example_str2 = "## is on the way";
let expect_str2_android = "%1$s%2$s is on the way";
let expect_str2_ios = "%@%@ is on the way";

let example_str3 = "# is a #";
let expect_str3_android = "%1$s is a %2$s";

let normal_str3 = "we are tubyy?";


describe("test android convert",()=>{

    it("test # font",()=>{
        let parser = new Translation2Android();
        let result = parser.android_line_transfer(example_str1);
        expect(result).toBe(expect_str1_android);
    });

    it("test tow #",()=>{
        let parser = new Translation2Android();
        let result = parser.android_line_transfer(example_str2);
        expect(result).toBe(expect_str2_android);
    });

    it("test two # front and end",()=>{
        let parser = new Translation2Android();
        let result = parser.android_line_transfer(example_str3);
        expect(result).toBe(expect_str3_android);
    });

    it("normal test str",()=>{
        let parser = new Translation2Android();
        let result = parser.android_line_transfer(normal_str3);
        expect(result).toBe(normal_str3);
    });

    
    
    it("test the ' can be escape",()=>{
        let parser = new Translation2Android();
        let testcase1 = "'vue' is js framwork";
        // @ts-ignore
        let result1 = parser.android_line_transfer(testcase1);
        expect(result1).toBe("\\'vue\\' is js framwork");

        let testcase2 = "I find 'vue' is js framwork";
        // @ts-ignore
        let result2 = parser.android_line_transfer(testcase2);
        expect(result2).toBe("I find \\'vue\\' is js framwork");

        let testcase3 = "I find 'vue' is js framwork, real good 'girl'";
        // @ts-ignore
        let result3 = parser.android_line_transfer(testcase3);
        expect(result3).toBe("I find \\'vue\\' is js framwork, real good \\'girl\\'");

    });

    it("test the \\' need not escape",()=>{
        let parser = new Translation2Android();
        let testcase1 = "\\'vue\\' is js framwork";
        // @ts-ignore
        let result1 = parser.android_line_transfer(testcase1);
        expect(result1).toBe("\\'vue\\' is js framwork");

        let testcase2 = "I find \\'vue\\' is js framwork";
        // @ts-ignore
        let result2 = parser.android_line_transfer(testcase2);
        expect(result2).toBe("I find \\'vue\\' is js framwork");

        let testcase3 = "I find \\'vue\\' is js framwork, real good \\'girl\\'\n";
        // @ts-ignore
        let result3 = parser.android_line_transfer(testcase3);
        expect(result3).toBe("I find \\'vue\\' is js framwork, real good \\'girl\\'\n");

    });

    it("test the \" can be escape",()=>{
        let parser = new Translation2Android();
        let testcase1 = "\"vue\" is js framwork";
        // @ts-ignore
        let result1 = parser.android_line_transfer(testcase1);
        expect(result1).toBe("\\\"vue\\\" is js framwork");

        let testcase2 = "I find \"vue\" is js framwork";
        // @ts-ignore
        let result2 = parser.android_line_transfer(testcase2);
        expect(result2).toBe("I find \\\"vue\\\" is js framwork");

        let testcase3 = "I find \"vue\" is js framwork, real good \"girl\"";
        // @ts-ignore
        let result3 = parser.android_line_transfer(testcase3);
        expect(result3).toBe("I find \\\"vue\\\" is js framwork, real good \\\"girl\\\"");

    });

    it("test the \\\" need not escape",()=>{
        let parser = new Translation2Android();
        let testcase1 = "\\\"vue\\\" is js framwork";
        // @ts-ignore
        let result1 = parser.android_line_transfer(testcase1);
        expect(result1).toBe("\\\"vue\\\" is js framwork");

        let testcase2 = "I find \\\"vue\\\" is js framwork";
        // @ts-ignore
        let result2 = parser.android_line_transfer(testcase2);
        expect(result2).toBe("I find \\\"vue\\\" is js framwork");

        let testcase3 = "I find \"vue\\\" is js framwork, real good \\\"girl\\\"";
        // @ts-ignore
        let result3 = parser.android_line_transfer(testcase3);
        expect(result3).toBe("I find \\\"vue\\\" is js framwork, real good \\\"girl\\\"");

    });

});

describe("test ios format",()=>{

    it("test ios # one",()=>{
        let parser = new Translation2iOS();
        // @ts-ignore
        let result = parser.ios_formate_line(example_str1);
        // @ts-ignore
        expect(result).toBe(expect_str1_ios);
    });


    it("test ios # two",()=>{
        let parser = new Translation2iOS();
        // @ts-ignore
        let result = parser.ios_formate_line(example_str2);
        // @ts-ignore
        expect(result).toBe(expect_str2_ios);
    });

    it("normal str test",()=>{
        let parser = new Translation2iOS();
        // @ts-ignore
        let result = parser.ios_formate_line(normal_str3);
        // @ts-ignore
        expect(result).toBe(normal_str3);
    });

    it("test the \" can be escape",()=>{
        let parser = new Translation2iOS();
        let testcase1 = "\"vue\" is js framwork";
        // @ts-ignore
        let result1 = parser.ios_escape_line(testcase1);
        expect(result1).toBe("\\\"vue\\\" is js framwork");

        let testcase2 = "I find \"vue\" is js framwork";
        // @ts-ignore
        let result2 = parser.ios_escape_line(testcase2);
        expect(result2).toBe("I find \\\"vue\\\" is js framwork");

        let testcase3 = "I find \"vue\" is js framwork, real good \"girl\"";
        // @ts-ignore
        let result3 = parser.ios_escape_line(testcase3);
        expect(result3).toBe("I find \\\"vue\\\" is js framwork, real good \\\"girl\\\"");

    });

    it("test the \\\" need not escape",()=>{
        let parser = new Translation2iOS();
        let testcase1 = "\\\"vue\\\" is js framwork";
        // @ts-ignore
        let result1 = parser.ios_escape_line(testcase1);
        expect(result1).toBe("\\\"vue\\\" is js framwork");

        let testcase2 = "I find \\\"vue\\\" is js framwork";
        // @ts-ignore
        let result2 = parser.ios_escape_line(testcase2);
        expect(result2).toBe("I find \\\"vue\\\" is js framwork");

        let testcase3 = "I find \"vue\\\" is js framwork, real good \\\"girl\\\"";
        // @ts-ignore
        let result3 = parser.ios_escape_line(testcase3);
        expect(result3).toBe("I find \\\"vue\\\" is js framwork, real good \\\"girl\\\"");

    });

});
