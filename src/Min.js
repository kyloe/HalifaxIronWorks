// Min.js
// library.js contains some convenience functions like 'isNull':
// This source is now managed under GIT

include("scripts/library.js");
include("scripts/WidgetFactory.js");
include("scripts/HXWorks/primitives.js");

//
// Create main object
//

function Min()
	{
	};

// ********************************************************************************************************************
//
// Top level creation
//
// ********************************************************************************************************************

Min.init = function(formWidget)
	{

	//
	// Read widget to get object from which we can extract parameters
	//

	if (!isNull(formWidget))
		{
		this.widgets = getWidgets(formWidget);
		}

	};

Min.generate = function(documentInterface, file)

//
// Main function to generate the frames
//

	{

	this.setValues();
	return this.create(documentInterface);
	};

Min.generatePreview = function(documentInterface, iconSize)
	{
	//
	// Function to generate the frames icon
	//

	return this.createIcon(documentInterface);

	};

Min.create = function(documentInterface)
	{

	// First create all the required layers

	var layers = ["Laser Cutting", "Text", "Etching", "Dimensions"];

	this.createLayers(documentInterface, layers);

	// Then add the items to each layer
	// empty layers will not be displayed
	// As the copy process in QCAD ignores them

	var addOperation = new RAddObjectsOperation(false);

	// Create a reference point which all others will be spaced from

	this.root = new RVector(0, 0);
	maxWidth = this.getFloat("MasonsOpeningWidth");
	//
	// This is where the actual creation stuff is done
	// 

	documentInterface.setCurrentLayer("Laser Cutting");

	this.createMasonsOpening(documentInterface, addOperation, this.root);
	// this.createFrameC(documentInterface, addOperation,
	// this.root.operator_add(new
	// RVector(this.getFloat("MasonsOpeningWidth")+100,0)));
	this.createFrameA(documentInterface, addOperation, offset(this.root,
			maxWidth, 1));

	this.createFrameC(documentInterface, addOperation, offset(this.root,
			maxWidth, 2));

	this.createCappedArch(documentInterface, addOperation, offset(this.root,
			maxWidth, 3));

	this.createFullSideBar(documentInterface, addOperation, offset(this.root,
			maxWidth, 4));

	this.createSplitSideBar(documentInterface, addOperation, offset(this.root,
			maxWidth, 5));

	this.createBottomBar(documentInterface, addOperation, offset(this.root,
			maxWidth, 6));

	addOperation.apply(documentInterface.getDocument());

	// and add some labels

	documentInterface.setCurrentLayer("Text");

	createText(documentInterface, addOperation, this.root
			.operator_add(new RVector(10, -10)), "Masons opening as measured");

	addOperation.apply(documentInterface.getDocument());

	// and add some Etchings

	documentInterface.setCurrentLayer("Etching");

	createText(documentInterface, addOperation, this.root
			.operator_add(new RVector(10, -20)),
			"PART & CUSTOMER DETAILS - to be etched");

	addOperation.apply(documentInterface.getDocument());

	//
	// Return the addOperation to the library insert wrapper
	// so it will be copied to the main document
	//

	return addOperation;

	};

Min.createFrameA = function(documentInterface, addOperation, pos)
// ********************************************************************************************************************
//
// 'Frame A' - cut and holed frame with no bends
//
// ********************************************************************************************************************
	{
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight");
	var allowance = this.getFloat("FrameARelativeWidth")
			+ this.getFloat("Allowance"); // 26+2.5
	var topOnly = true;
	createGothicArchRel(documentInterface, addOperation, pos, radius, width,
			height, allowance);
	// TODO: Work out why 20 - needs to be derived from UI
	createGothicArchRel(documentInterface, addOperation, pos, radius, width,
			height, 20, topOnly);
	// createGothicArchRel(documentInterface,
	// addOperation,pos,radius,width,height,allowance+this.getFloat("FrameCBarWidth"));
	var spring = getGothicSpring(radius,width,height);
	this.createFrameAOutline(documentInterface, addOperation,pos.operator_add(new RVector(-9.5,0)),width+19,spring);
	//TODO: Work out why this is 19 ??
	};
		
Min.createFrameAOutline = function(documentInterface, addOperation,pos,width,spring) {
var height 			= this.getFloat("MasonsOpeningHeight")-this.getFloat("FrameARelativeHeight");
var cutoutWidth 	= this.getFloat("CutoutWidth");
var cutoutHeight 	= this.getFloat("CutoutHeight");
var bendReliefSlotWidth = this.getFloat("BendReliefSlotWidth");

var va = new Array(
		
        pos.operator_add(new RVector(cutoutWidth-bendReliefSlotWidth,cutoutHeight)),
        pos.operator_add(new RVector(0, cutoutHeight)),
        pos.operator_add(new RVector(0, spring)),
        pos.operator_add(new RVector(cutoutWidth-bendReliefSlotWidth, spring))
);

createPolyLine(documentInterface, addOperation, va);

//var va2 = new Array(
//        pos.operator_add(new RVector(cutoutWidth, height-cutoutHeight)),
//        pos.operator_add(new RVector(cutoutWidth, height)),
//        pos.operator_add(new RVector(width-cutoutWidth,height)),
//        pos.operator_add(new RVector(width-cutoutWidth,height-cutoutHeight))
// );
//
//createPolyLine(documentInterface, addOperation, va2);

var va3 = new Array(
       pos.operator_add(new RVector(width-cutoutWidth+bendReliefSlotWidth,spring)),
        pos.operator_add(new RVector(width,spring)),
        pos.operator_add(new RVector(width,cutoutHeight)),
        pos.operator_add(new RVector(width-cutoutWidth+bendReliefSlotWidth,cutoutHeight))
);
createPolyLine(documentInterface, addOperation, va3);

var va4 = new Array(
        pos.operator_add(new RVector(width-cutoutWidth,cutoutHeight)),
        pos.operator_add(new RVector(width-cutoutWidth,0)),
        pos.operator_add(new RVector(cutoutWidth,0)),
        pos.operator_add(new RVector(cutoutWidth,cutoutHeight))
);
createPolyLine(documentInterface, addOperation, va4);

// Now insert the bend reliefs

var diameter 	= this.getFloat("BendReliefDiameter");
var slotWidth = this.getFloat("BendReliefSlotWidth");
var slotLength 	= this.getFloat("BendReliefSlotLength");

createVBendRelief(documentInterface, addOperation,pos.operator_add(new RVector(cutoutWidth-bendReliefSlotWidth,cutoutHeight)),1,1, diameter, slotWidth, slotLength);
createVBendRelief(documentInterface, addOperation,pos.operator_add(new RVector(cutoutWidth-bendReliefSlotWidth, height-cutoutHeight)),-1,1, diameter, slotWidth, slotLength);
createVBendRelief(documentInterface, addOperation,pos.operator_add(new RVector(width-cutoutWidth,height-cutoutHeight)),-1,-1, diameter, slotWidth, slotLength);
createVBendRelief(documentInterface, addOperation,pos.operator_add(new RVector(width-cutoutWidth,cutoutHeight)),1,-1, diameter, slotWidth, slotLength);

};


Min.createFrameC = function(documentInterface, addOperation, pos)
// ********************************************************************************************************************
//
// 'Frame C' - cut and holed frame with no bends
//
// ********************************************************************************************************************
	{
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight");
	var allowance = this.getFloat("FrameCRelativeWidth") / 2
			+ this.getFloat("Allowance"); // 6+2.5

	createGothicArchRel(documentInterface, addOperation, pos, radius, width,
			height, allowance);

	createGothicArchRel(documentInterface, addOperation, pos, radius, width,
			height, allowance + this.getFloat("FrameCBarWidth"));

	var weldTabBarHeight = getGothicSpring(radius, width, height) - allowance;

	// var weldTabPos = pos.operator_add(
	// new
	// RVector(allowance+this.getFloat("FrameCBarWidth")/2-this.getFloat("WeldLugHoleWidth")/2-this.getFloat("WeldLugHoleClearance")/2,
	// allowance+this.getFloat("WeldLugInset")));

	this.createWeldTabHoleLine(documentInterface, addOperation, pos
			.operator_add(new RVector(allowance, allowance)), weldTabBarHeight,
			this.getFloat("FrameCBarWidth"), NORTH);
	this.createWeldTabHoleLine(documentInterface, addOperation, pos
			.operator_add(new RVector(width - allowance
					- this.getFloat("FrameCBarWidth"), allowance)),
			weldTabBarHeight, this.getFloat("FrameCBarWidth"), NORTH);
	this.createWeldTabHoleLine(documentInterface, addOperation, pos
			.operator_add(new RVector(allowance, allowance)), width - 2
			* allowance, this.getFloat("FrameCBarWidth"), EAST);

	}

Min.createCappedArch = function(documentInterface, addOperation, pos)

// ********************************************************************************************************************
//
// Capped arc
//
// ********************************************************************************************************************

	{
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var allowance = this.getFloat("FrameCRelativeWidth") / 2
			+ this.getFloat("Allowance") + 10; // TODO - work out why this is
												// 10

	createCappedGothicArch(documentInterface, addOperation, pos, radius, width
			- 2 * allowance, 20);

	this.addDimensions(documentInterface, addOperation, pos
			.operator_add(new RVector(0, 0)), pos.operator_add(new RVector(
			width - 2 * allowance, 0)), pos.operator_add(new RVector(0, -50)));

	}

Min.createFullSideBar = function(di, ao, pos)
// ********************************************************************************************************************
//
// Full side bar
//
// ********************************************************************************************************************
	{
	// Calculate height same as hole calc in Frame C
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight");
	var allowance = this.getFloat("FrameCRelativeWidth") / 2
			+ this.getFloat("Allowance"); // 6+2.5
	var sidebarHeight = getGothicSpring(radius, width, height) - allowance;

	var sidebarWidth = this.getFloat("SidebarWidth");
	// Pick up params before calling generic routine
	var mountingLugInset = this.getFloat("MountingLugInset");
	var mountingLugMinSpacing = this.getFloat("MountingLugMinSpacing");
	var weldLugInset = this.getFloat("WeldLugInset");
	var weldLugMinSpacing = this.getFloat("WeldLugMinSpacing");
	var weldLugMaxSpacing = this.getFloat("WeldLugMaxSpacing");
	var weldLugWidth = this.getFloat("WeldLugWidth");
	var weldLugDepth = this.getFloat("WeldLugDepth");
	var lugHoleDiameter = this.getFloat("LugHoleDiameter");
	var lugWidth = this.getFloat("LugWidth");
	var lugHoleOffset = this.getFloat("LugHoleOffset");
	createSidebar(di, ao, pos, sidebarHeight, sidebarWidth, mountingLugInset,
			mountingLugMinSpacing, weldLugInset, weldLugWidth, weldLugDepth,
			weldLugMinSpacing, weldLugMaxSpacing, lugHoleDiameter, lugWidth,
			lugHoleOffset)

	this.addDimensions(di, ao, pos, pos.operator_add(new RVector(0,
			sidebarHeight)), pos.operator_add(new RVector(-40,
			sidebarHeight / 2)));
	};

Min.createSplitSideBar = function(di, ao, pos)
// ********************************************************************************************************************
//
// Split side bar
//
// ********************************************************************************************************************
	{
	// Calculate height same as hole calc in Frame C
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight");
	var allowance = this.getFloat("FrameCRelativeWidth") / 2
			+ this.getFloat("Allowance"); // 6+2.5
	var sidebarHeight = getGothicSpring(radius, width, height) - allowance;

	var sidebarWidth = this.getFloat("SidebarWidth");
	// Pick up params before calling generic routine
	var mountingLugInset = this.getFloat("MountingLugInset");
	var mountingLugMinSpacing = this.getFloat("MountingLugMinSpacing");
	var weldLugInset = this.getFloat("WeldLugInset");
	var weldLugMinSpacing = this.getFloat("WeldLugMinSpacing");
	var weldLugMaxSpacing = this.getFloat("WeldLugMaxSpacing");
	var weldLugWidth = this.getFloat("WeldLugWidth");
	var weldLugDepth = this.getFloat("WeldLugDepth");
	var lugHoleDiameter = this.getFloat("LugHoleDiameter");
	var lugWidth = this.getFloat("LugWidth");
	var lugHoleOffset = this.getFloat("LugHoleOffset");

	createSidebar(di, ao, pos, 75, sidebarWidth, mountingLugInset,
			mountingLugMinSpacing, weldLugInset, weldLugWidth, weldLugDepth,
			weldLugMinSpacing, weldLugMaxSpacing, lugHoleDiameter, lugWidth,
			lugHoleOffset)
	createSidebar(di, ao, pos.operator_add(new RVector(0, 107)),
			(sidebarHeight - 246) / 2, sidebarWidth, mountingLugInset,
			mountingLugMinSpacing, weldLugInset, weldLugWidth, weldLugDepth,
			weldLugMinSpacing, weldLugMaxSpacing, lugHoleDiameter, lugWidth,
			lugHoleOffset)
	createSidebar(di, ao, pos.operator_add(new RVector(0,
			139 + (sidebarHeight - 246) / 2)), (sidebarHeight - 246) / 2,
			sidebarWidth, mountingLugInset, mountingLugMinSpacing,
			weldLugInset, weldLugWidth, weldLugDepth, weldLugMinSpacing,
			weldLugMaxSpacing, lugHoleDiameter, lugWidth, lugHoleOffset)
	createSidebar(di, ao, pos.operator_add(new RVector(0, sidebarHeight - 75)),
			75, sidebarWidth, mountingLugInset, mountingLugMinSpacing,
			weldLugInset, weldLugWidth, weldLugDepth, weldLugMinSpacing,
			weldLugMaxSpacing, lugHoleDiameter, lugWidth, lugHoleOffset)

	this.addDimensions(di, ao, pos, pos.operator_add(new RVector(0,
			sidebarHeight)), pos.operator_add(new RVector(-40,
			sidebarHeight / 2)));
	}

Min.createBottomBar = function(di, ao, pos)
// ********************************************************************************************************************
//
// Bottom bar
//
// ********************************************************************************************************************
	{
	// Calculate height same as hole calc in Frame C
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight");
	var allowance = this.getFloat("FrameCRelativeWidth") / 2
			+ this.getFloat("Allowance"); // 6+2.5
	var sidebarHeight = this.getFloat("MasonsOpeningWidth") - 2 * allowance;

	var sidebarWidth = this.getFloat("SidebarWidth");
	// Pick up params before calling generic routine
	var mountingLugInset = this.getFloat("MountingLugInset");
	var mountingLugMinSpacing = this.getFloat("MountingLugMinSpacing");
	var weldLugInset = this.getFloat("WeldLugInset");
	var weldLugMinSpacing = this.getFloat("WeldLugMinSpacing");
	var weldLugMaxSpacing = this.getFloat("WeldLugMaxSpacing");
	var weldLugWidth = this.getFloat("WeldLugWidth");
	var weldLugDepth = this.getFloat("WeldLugDepth");
	var lugHoleDiameter = this.getFloat("LugHoleDiameter");
	var lugWidth = this.getFloat("LugWidth");
	var lugHoleOffset = this.getFloat("LugHoleOffset");

	createSidebar(di, ao, pos, sidebarHeight, sidebarWidth, mountingLugInset,
			mountingLugMinSpacing, weldLugInset, weldLugWidth, weldLugDepth,
			weldLugMinSpacing, weldLugMaxSpacing, lugHoleDiameter, lugWidth,
			lugHoleOffset)

	this.addDimensions(di, ao, pos, pos.operator_add(new RVector(0,
			sidebarHeight)), pos.operator_add(new RVector(-40,
			sidebarHeight / 2)));
	}

Min.createMasonsOpening = function(documentInterface, addOperation, pos)

// ********************************************************************************************************************
//
// Masons Opening
//
// ********************************************************************************************************************

	{
	this.createMasonsOpeningOutline(documentInterface, addOperation, pos);
	this.createMasonsOpeningArch(documentInterface, addOperation, pos);
	this.createMasonsOpeningDimensions(documentInterface, addOperation, pos);
	};

Min.createMasonsOpeningArch = function(documentInterface, addOperation, pos)
	{
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight")

	createGothicArchRel(documentInterface, addOperation, pos, radius, width,
			height, 0);
	}

Min.createMasonsOpeningOutline = function(documentInterface, addOperation, pos)
	{
	var radius = this.getFloat("Radius");
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight")

	var outerLines = [
			pos.operator_add(new RVector(0, getGothicSpring(radius, width,
					height))),
			pos,
			pos.operator_add(new RVector(width, 0)),
			pos.operator_add(new RVector(width, getGothicSpring(radius, width,
					height)))];

	createPolyLine(documentInterface, addOperation, outerLines);
	};

Min.createMasonsOpeningDimensions = function(documentInterface, addOperation,
		pos)
	{
	var width = this.getFloat("MasonsOpeningWidth");
	var height = this.getFloat("MasonsOpeningHeight")

	this.addDimensions(documentInterface, addOperation, pos
			.operator_add(new RVector(width / 2, 0)), pos
			.operator_add(new RVector(width / 2, height)), pos
			.operator_add(new RVector(-25, height / 2)));

	this.addDimensions(documentInterface, addOperation, pos, pos
			.operator_add(new RVector(width, 0)), pos.operator_add(new RVector(
			0, -50)));

	}

// ********************************************************************************************************************
//
// Support functions
//
// ********************************************************************************************************************

Min.createWeldTabHoleLine = function(documentInterface, addOperation, pos,
		length, width, orientation)
	{
	// Convenience wrapper to save getting the standard dims every time
	// pos is bottom left corner of bar
	// 
	var minSpacing = this.getFloat("WeldLugMinSpacing");
	var maxSpacing = this.getFloat("WeldLugMaxSpacing");

	var weldLugWidth = this.getFloat("WeldLugWidth");
	var weldLugHoleWidth = this.getFloat("WeldLugHoleWidth");
	var weldLugHoleClearance = this.getFloat("WeldLugHoleClearance");
	var weldLugInset = this.getFloat("WeldLugInset");

	createWeldTabHoleLine(documentInterface, addOperation, pos, length, width,
			minSpacing, maxSpacing, orientation, weldLugWidth,
			weldLugHoleWidth, weldLugHoleClearance, weldLugInset);

	}

Min.createIcon = function(documentInterface)
	{

	var addOperation = new RAddObjectsOperation(false);

	createRectangle(documentInterface, addOperation, new RVector(0, 0), 10, 12);
	createRectangle(documentInterface, addOperation, new RVector(1, 1), 8, 10);

	createText(documentInterface, addOperation, new RVector(0, 0), "MN");
	createText(documentInterface, addOperation, new RVector(3, 7), "00");

	return addOperation;
	};

Min.createLayers = function(documentInterface, layers)

//
// createLayers: adds a number of layers from an array of text labels
//
	{

	var addLayerOperation = new RAddObjectsOperation(false);

	for (i = 0; i < layers.length; i++)
		{
		addLayerOperation
				.addObject(new RLayer(documentInterface.getDocument(),
						layers[i], false, false, documentInterface
								.getCurrentColor(), documentInterface
								.getCurrentLinetypeId(), RLineweight.Weight005));
		}

	addLayerOperation.apply(documentInterface.getDocument());

	};

Min.addDimensions = function(documentInterface, addOperation, p1, p2, pDim)
// Add dimension lines, from p1 to p2 with dimensions at pDim
	{
	// Stash teh layer we're using presently
	currentLayerId = documentInterface.getDocument().getCurrentLayerId();

	addOperation.apply(documentInterface.getDocument());
	// Change to dimensions layer
	documentInterface.getDocument().setCurrentLayer("Dimensions");

	var dim = new RDimAlignedData();

	dim.setExtensionPoint1(p1);
	dim.setExtensionPoint2(p2);
	dim.setDefinitionPoint(pDim);

	var dimEnt = new RDimAlignedEntity(documentInterface.getDocument(), dim);

	addOperation.addObject(dimEnt, false);
	addOperation.apply(documentInterface.getDocument());

	// Back to our previous layer
	documentInterface.getDocument().setCurrentLayer(currentLayerId);
	}

Min.getText = function(label)
	{
	if (this.hasOwnProperty(label))
		{
		return this[label];
		}
	else if (this.widgets[label])
		{
		return this.widgets[label].text;
		}
	else
		{
		return label.concat(": not defined");
		}

	}

Min.getFloat = function(label)
	{

	if (this.hasOwnProperty(label))
		{
		return this[label];
		}
	else if (this.widgets[label]) // / This test is not working
		{
		return parseFloat(this.widgets[label].text);
		}
	else
		{
		return label.concat(": not defined");
		}
	}

Min.getBoolean = function(label)
	{
	if (this.hasOwnProperty(label))
		{
		return this[label];
		}
	else if (this.widgets[label])
		{
		return this.widgets[label].checked;
		}
	else
		{
		return label.concat(": not defined");
		}
	}

Min.setValues = function()
	{

	//
	// Set requested sizes (default sizes are suitable for ICON generation
	//

	this.customerName = this.widgets["CustomerName"].text;
	this.MasonsOpeningWidth = parseFloat(
			this.widgets["MasonsOpeningWidth"].text, 10);
	this.MasonsOpeningHeight = parseFloat(
			this.widgets["MasonsOpeningHeight"].text, 10);
	this.cutoutHeight = parseFloat(this.widgets["CutoutHeight"].text, 10);
	this.cutoutWidth = parseFloat(this.widgets["CutoutWidth"].text, 10);

	this.frameARelativeWidth = parseFloat(
			this.widgets["FrameARelativeWidth"].text, 10);
	this.frameARelativeHeight = parseFloat(
			this.widgets["FrameARelativeHeight"].text, 10);
	this.frameABarWidth = parseFloat(this.widgets["FrameABarWidth"].text, 10);
	this.frameABarHeight = parseFloat(this.widgets["FrameABarHeight"].text, 10);
	this.frameAPlasticHoleSpacing = parseFloat(
			this.widgets["FrameAPlasticHoleSpacing"].text, 10);

	this.handleRampHoleHeight = parseFloat(
			this.widgets["HandleRampHoleHeight"].text, 10);
	this.handleRampHoleWidth = parseFloat(
			this.widgets["HandleRampHoleWidth"].text, 10);
	this.handleRampHoleCentres = parseFloat(
			this.widgets["HandleRampHoleCentres"].text, 10);
	this.handleRampHoleInset = parseFloat(
			this.widgets["HandleRampHoleInset"].text, 10);

	this.frameCRelativeWidth = parseFloat(
			this.widgets["FrameCRelativeWidth"].text, 10);
	this.frameCRelativeHeight = parseFloat(
			this.widgets["FrameCRelativeHeight"].text, 10);
	this.frameCBarWidth = parseFloat(this.widgets["FrameCBarWidth"].text, 10);
	this.frameCBarHeight = parseFloat(this.widgets["FrameCBarHeight"].text, 10);

	this.frameCHingeHoleWidth = parseFloat(
			this.widgets["FrameCHingeHoleWidth"].text, 10);
	this.frameCHingeHoleHeight = parseFloat(
			this.widgets["FrameCHingeHoleHeight"].text, 10);
	this.frameCHingeHoleCentreW = parseFloat(
			this.widgets["FrameCHingeHoleCentreW"].text, 10);
	this.frameCHingeHoleCentreH = parseFloat(
			this.widgets["FrameCHingeHoleCentreH"].text, 10);

	this.holeDiameter = parseFloat(this.widgets["HoleDiameter"].text, 10);
	this.plasticHoleDiameter = parseFloat(
			this.widgets["PlasticHoleDiameter"].text, 10);
	this.bendReliefDiameter = parseFloat(
			this.widgets["BendReliefDiameter"].text, 10);
	this.bendReliefSlotWidth = parseFloat(
			this.widgets["BendReliefSlotWidth"].text, 10);
	this.bendReliefSlotLength = parseFloat(
			this.widgets["BendReliefSlotLength"].text, 10);

	this.lugWidth = parseFloat(this.widgets["LugWidth"].text, 10);
	this.lugHoleOffset = parseFloat(this.widgets["LugHoleOffset"].text, 10);
	this.lugHoleDiameter = parseFloat(this.widgets["LugHoleDiameter"].text, 10);
	this.mountingLugInset = parseFloat(this.widgets["MountingLugInset"].text,
			10);
	this.mountingLugMinSpacing = parseFloat(
			this.widgets["MountingLugMinSpacing"].text, 10);
	this.mountingLugMaxSpacing = parseFloat(
			this.widgets["MountingLugMaxSpacing"].text, 10);

	this.sidebarWidth = parseFloat(this.widgets["SidebarWidth"].text, 10);
	this.sidebarRelativeHeight = parseFloat(
			this.widgets["SidebarRelativeHeight"].text, 10);
	this.sidebarSealHoleSpacing = parseFloat(
			this.widgets["SidebarSealHoleSpacing"].text, 10);
	this.sidebarSealHoleDiameter = parseFloat(
			this.widgets["SidebarSealHoleDiameter"].text, 10);

	this.weldLugWidth = parseFloat(this.widgets["WeldLugWidth"].text, 10);
	this.weldLugDepth = parseFloat(this.widgets["WeldLugDepth"].text, 10);
	this.weldLugInset = parseFloat(this.widgets["WeldLugInset"].text, 10);
	this.weldLugMinSpacing = parseFloat(this.widgets["WeldLugMinSpacing"].text,
			10);
	this.weldLugMaxSpacing = parseFloat(this.widgets["WeldLugMaxSpacing"].text,
			10);
	this.weldLugHoleWidth = parseFloat(this.widgets["WeldLugHoleWidth"].text,
			10);
	this.weldLugHoleClearance = parseFloat(
			this.widgets["WeldLugHoleClearance"].text, 10);

	this.topbarBarWidth = parseFloat(this.widgets["TopBarWidth"].text, 10);
	this.topbarRelativeWidth = parseFloat(
			this.widgets["TopBarRelativeWidth"].text, 10);
	this.handleRampHolePosition = parseFloat(
			this.widgets["HandleRampHolePosition"].text, 10);
	this.includeRampHandle = this.widgets["IncludeRampHandle"].checked;

	this.setDerivedValues();

	};

Min.setDerivedValues = function()
	{

	//
	// Set up a few derived fvalues that will be used repeatedly
	//
	this.frameAWidth = this.MasonsOpeningWidth + this.frameARelativeWidth;
	this.frameAHeight = this.MasonsOpeningHeight + this.frameARelativeHeight;
	this.frameARoot = new RVector(0,
			(this.MasonsOpeningHeight - this.frameARelativeHeight) / 2);

	// this.frameCWidth = this.finishedWidth+this.frameCRelativeWidth;
	// this.frameCHeight = this.finishedHeight+this.frameCRelativeHeight;

	this.frameCWidth = this.getFloat("MasonsOpeningWidth")
			+ this.getFloat("FrameCRelativeWidth");
	this.frameCHeight = this.getFloat("MasonsOpeningHeight")
			+ this.getFloat("FrameCRelativeHeight");

	this.frameCRoot = new RVector(-1.2 * this.MasonsOpeningWidth,
			(this.MasonsOpeningHeight - this.frameCRelativeHeight) / 2);

	this.sidebarHeight = this.MasonsOpeningHeight + this.sidebarRelativeHeight;
	this.sidebarRoot = new RVector(-1.5 * this.MasonsOpeningWidth,
			(this.MasonsOpeningHeight - this.sidebarRelativeHeight) / 2);

	this.topbarRoot = new RVector(this.frameCRoot.getX()
			+ (this.frameCWidth - this.topbarWidth) / 2,
			this.frameCHeight * 1.6);

	this.topbarWidth = this.MasonsOpeningWidth + this.topbarRelativeWidth;
	this.bottombarRoot = new RVector(this.frameCRoot.getX()
			+ (this.frameCWidth - this.topbarWidth) / 2,
			this.frameCHeight * 0.2);

	};
