namespace fgui.utils {

	export class NumberUtil {

		public static RADIAN:number = Math.PI / 180;

		public static clamp(value: number, min: number, max: number): number {
			if (value < min)
				value = min;
			else if (value > max)
				value = max;
			return value;
		}

		public static clamp01(value: number): number {
			if (value > 1)
				value = 1;
			else if (value < 0)
				value = 0;
			return value;
		}

		public static isNumber(n: any): n is number {
			if (typeof (n) != "number") return false;
			if (isNaN(n)) return false;
			return true;
		}

		public static sign(x:number):number {
			x = Number(x);
			
			if (x === 0 || isNaN(x))
				return x;
	
			return x > 0 ? 1 : -1;
		}

		public static angleToRadian(n:number):number {
			return n * NumberUtil.RADIAN;
		}
		
		public static lerp(s:number, e:number, p:number):number {
			return s + p * (e - s);
		}
	}
}