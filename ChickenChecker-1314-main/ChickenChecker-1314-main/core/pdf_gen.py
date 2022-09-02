import sys, os
import datetime

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, TableStyle, Table, Spacer, Frame, Image, SimpleDocTemplate, Paragraph, ListFlowable,\
    ListItem
from reportlab.lib.styles import getSampleStyleSheet\
    
from .analysis import update_graphs

# g_stylesheet = styles()

# replay summary
# click the button for "get report" in house view
# make a request to generate pdf for house (with given id)
    # ok here is a document; call analysis function - throw figs into pdf
    # return pdf file - set to house file field - open in web browser

def house_report(house):
    elems = []  # elements array used to build pdf structure'
    style = getSampleStyleSheet()

    pdf = SimpleDocTemplate(f"core/data/visuals/houses/{house.id}/report.pdf",
                            pagesize=letter,
                            leftMargin=0.75 * inch,
                            rightMargin=0.75 * inch,
                            topMargin=0.75 * inch,
                            bottomMargin=0.75 * inch
                            )
    elems.append(Paragraph(f"ChickenChecker \n {house.farm.user.last_name} House {house.id} Report", style['Title']))
    elems.append(Paragraph(f"The following report and the figures and data within it are generated from analysis data \
                                recorded by the monitors in the broiler house. The AudioT monitors are able to record and \
                                analyze ambient audio from the chicken houses and categorize vocal anomalies into 5 different\
                                levels. Level 1 events are snicks while level 5 events are severe coughing.", style['Normal']))
    
    lastnight = house.lastDataTimestampProcessed
    start = lastnight - datetime.timedelta(days=1)
    elems.append(Spacer(0, 50))

    # LAST NIGHT
    elems.append(Paragraph(f"Last Night: 22:00 {start.month}/{start.day}/{start.year} - 06:00 {lastnight.month}/{lastnight.day}/{lastnight.year}", style['Heading1']))

    ## SNICK BREAKDOWN
    elems.append(Paragraph(f"Snick Breakdown (Level 1 Event Counts)", style['Heading2']))
    elems.append(Paragraph(f"The following figures show the prevalence of snicking throughout the house according to the number of level 1 events recorded by the monitors.", style['Normal']))
    elems.append(Paragraph(f"The figure on the left shows the total number of snicks recorded in the house over the period of last night. The horizontal line is a threshold that is considered a point of concern (x=60).", style['Normal']))
    elems.append(Paragraph(f"The figure on the right shows the distribution of snicks across each monitor to illustrate areas of concern.", style['Normal']))
    
    
    # TODO: FIGURE event 1 line graph over night (by hour) with threshold
    # TODO: FIGURE event 1 pie graph by monitor
    # generates all graphs; make base path for other things
    update_graphs(house)
    base_path = os.path.join(sys.path[0], 'core', 'data', 'visuals', 'houses', str(house.id), 'graphs', '')
    
    figure1_path = os.path.join(base_path, 'line_1s.png')
    figure2_path = os.path.join(base_path, 'pie.png')
    
    data = [[Image(figure1_path, width=300, height=300, hAlign='LEFT'), 
            Image(figure2_path, width=300, height=300, hAlign='LEFT') ]]
    elems.append(Table(data, style=TableStyle([('VALIGN', (0, 0), (-1, -1), 'MIDDLE')])))
    
    ## ALERT BREAKDOWN
    elems.append(Paragraph(f"Alert Category Breakdown", style['Heading2']))
    elems.append(Paragraph(f"The figure on the left is the total number of counts for each type of alert (1-5) over the period of last night.", style['Normal']))
    elems.append(Paragraph(f"The figure on the right is a bar graph that shows the distribution of each event type binned by hour throughout the entire house.", style['Normal']))
    # TODO: FIGURE all events line graph over night (by hour) with threshold included??
    # TODO: FIGURE event category distribution by hour
    
    figure3_path = os.path.join(base_path, 'line.png')
    figure4_path = os.path.join(base_path, 'bar.png')
    data2 = [[Image(figure3_path, width=300, height=300, hAlign='LEFT'), 
            Image(figure4_path, width=300, height=300, hAlign='LEFT') ]]
    elems.append(Table(data2, style=TableStyle([('VALIGN', (0, 0), (-1, -1), 'MIDDLE')])))
    
    
    
    ## MONITOR BREAKDOWN
    elems.append(Paragraph(f"Monitor Breakdown", style['Heading2']))
    elems.append(Paragraph(f"This section is intended to show the prevalence of disease across the geography of the house to show which areas need more attention.", style['Normal']))
    elems.append(Paragraph(f"The bar graph below shows the distribution of each event type across the night using total values from the entire house.", style['Normal']))


    # heading 1: last 3 days
    figure5_path = os.path.join(base_path, 'bar_monitors.png')
    elems.append(Image(figure5_path))
    
    
    
    pdf.build(elems)
    # house.report = 
    return pdf.filename
    

    