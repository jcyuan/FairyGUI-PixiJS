namespace fgui.controller {
	export class ChangePageAction extends Action {

		public objectId: string;
		public controllerName: string;
		public targetPage: string;

		protected enter(controller: Controller): void {
			if (!this.controllerName)
				return;

			let gcom: GComponent;
			if (this.objectId)
				gcom = controller.parent.getChildById(this.objectId) as GComponent;
			else
				gcom = controller.parent;
			if (gcom) {
				let cc: Controller = gcom.getController(this.controllerName);
				if (cc && cc != controller && !cc.$updating)
					cc.selectedPageId = this.targetPage;
			}
		}

		public setup(xml: fgui.utils.XmlNode): void {
			super.setup(xml);

			this.objectId = xml.attributes.objectId;
			this.controllerName = xml.attributes.controller;
			this.targetPage = xml.attributes.targetPage;
		}
	}
}