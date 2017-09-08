namespace fgui {

	export class DisplayListItem {
		public packageItem: PackageItem;
		public type: string;
		public desc: utils.XmlNode;
		public listItemCount: number;

		public constructor(packageItem: PackageItem, type: string) {
			this.packageItem = packageItem;
			this.type = type;
		}
	}
}