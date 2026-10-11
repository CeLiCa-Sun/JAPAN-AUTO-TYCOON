import {calculateEngine,type EngineDesign} from "./calculation";
import {evaluateCalibration,type MeasuredPoint,type CalibrationSummary} from "./calibration";
/** Fit only a scalar correction to the model's predicted power, not physical engine coefficients.
 * Training and holdout RPMs are separated by the caller; no data-derived leakage.
 */
export interface HoldoutReport {scale:number;train:CalibrationSummary;validation:CalibrationSummary;trainRpms:number[];validationRpms:number[];status:"empirical-scalar-preview"}
export function fitPowerScaleHoldout(engine:EngineDesign,training:readonly MeasuredPoint[],holdout:readonly MeasuredPoint[]):HoldoutReport {
 if(training.length<3||holdout.length<2)throw new RangeError("Require at least 3 train and 2 holdout points");
 const rpms=new Set(training.map(p=>p.rpm));
 if(holdout.some(p=>rpms.has(p.rpm)))throw new RangeError("Training and holdout RPM overlap");
 // Validation is performed using the existing strict measurement integrity checks.
 evaluateCalibration(engine,training);
 // Holdout needs only two samples; validate each sample via the strict existing
 // measured-point checks without using the 3-point calibration minimum.
 for(const sample of holdout){
  const calibrationSet=[sample,...training.slice(0,2)];
  evaluateCalibration(engine,calibrationSet);
 }
 const xs=training.map(p=>calculateEngine({...engine,rpm:p.rpm}).powerKw);
 const denominator=xs.reduce((acc,x)=>acc+x*x,0);
 if(denominator<=0)throw new RangeError("Invalid predicted power");
 const scale=xs.reduce((acc,x,i)=>acc+x*training[i].powerKw,0)/denominator;
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError("Invalid fitted scale");
 const compare=(points:readonly MeasuredPoint[]):CalibrationSummary=>{
  const rows=points.map(p=>{const predictedKw=calculateEngine({...engine,rpm:p.rpm}).powerKw*scale;return {rpm:p.rpm,observedKw:p.powerKw,predictedKw,percentageError:100*(predictedKw-p.powerKw)/p.powerKw};});
  const errors=rows.map(r=>r.predictedKw-r.observedKw);
  return {count:rows.length,meanAbsolutePercentageError:rows.reduce((a,r)=>a+Math.abs(r.percentageError),0)/rows.length,maxAbsolutePercentageError:Math.max(...rows.map(r=>Math.abs(r.percentageError))),rootMeanSquaredErrorKw:Math.sqrt(errors.reduce((a,e)=>a+e*e,0)/rows.length),meanBiasKw:errors.reduce((a,e)=>a+e,0)/rows.length,points:rows};
 };
 return {scale,train:compare(training),validation:compare(holdout),trainRpms:training.map(p=>p.rpm),validationRpms:holdout.map(p=>p.rpm),status:"empirical-scalar-preview"};
}
