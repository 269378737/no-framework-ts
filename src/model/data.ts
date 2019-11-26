
/**
 * 疾病模型接口
 */
interface IRiskScoreModel {
    cutoff: number[]
}

interface IDensity {
    xy: number[][],
    cutoff: number[]
}

interface IDiseaseModel {
    riskScore: IRiskScoreModel;
    density: IDensity
}

export interface IChartModel {
    AMI?: IDiseaseModel,
    CKD?: IDiseaseModel,
    T2D?: IDiseaseModel,
    HUA?: IDiseaseModel
}




/** 
 * 病人疾病数据接口
 */

interface IDiseaseData {
    riskScore: number;
    riskLevel: string;
    density: number;
}

export interface IDisease {
    AMI?: IDiseaseData,
    CKD?: IDiseaseData,
    T2D?: IDiseaseData,
    HUA?: IDiseaseData
}

export interface IPatientDiseaseData {
    testID: string;
    model: IDisease;
}

/**
 * 病人基本信息接口
 */
export interface IBaseInformation {
    testID: string;
    name: string;
    nameEncrypt: string;
    age: string;
    gender: string;
    sampleId: string;
    checkDate: string,
    height: string,
    weight: string,
    bloodPressure: string,
    waistLine: string
}