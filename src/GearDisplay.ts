namespace fgui {

    export class GearDisplay extends GearBase<GObject> {

        private $vid:number = 0;
        public pages: string[];

        public constructor(owner: GObject) {
            super(owner);
            this.$lockToken = 1;
        }

        protected init(): void {
            this.pages = null;
        }

        public lock():number {
			this.$vid++;
			return this.$lockToken;
		}
		
		public release(token:number):void
		{
			if(token == this.$lockToken)
				this.$vid--;
        }
        
        public get connected():boolean {
			return this.controller == null || this.$vid > 0;
		}

        public apply(): void {
            this.$lockToken++;
			if(this.$lockToken <= 0)
                this.$lockToken = 1;
			
			if(this.pages == null || this.pages.length == 0 
				|| this.pages.indexOf(this.$controller.selectedPageId) != -1)
				this.$vid = 1;
			else
                this.$vid = 0;
        }
    }
}