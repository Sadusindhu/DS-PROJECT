"""
Script to generate sample PDFs for testing Assignment Project 1 and Project 2.
- Python_Programming_Notes.pdf (with OOP & Inheritance specifically on Page 12)
- AWS_Cloud_Notes.pdf (with Cloud computing, EC2, S3, RDS, VPC)
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_python_notes(output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=12
    )
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )
    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0F172A'),
        backColor=colors.HexColor('#F1F5F9'),
        borderPadding=6,
        spaceAfter=10
    )

    story = []
    
    # Pages 1 to 11
    topics = [
        ("Python Overview & Environment Setup", 
         "Python is an interpreted, high-level, general-purpose programming language. Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with the use of significant indentation."),
        ("Variables and Data Types in Python",
         "Python features dynamic typing. Key built-in data types include integers, floating-point numbers, strings, booleans, and complex numbers. Variables in Python do not require explicit declaration before use."),
        ("Python Operators and Expressions",
         "Python supports arithmetic operators (+, -, *, /, //, %, **), comparison operators (==, !=, <, >, <=, >=), logical operators (and, or, not), bitwise operators, and assignment operators."),
        ("Control Flow: Conditionals in Python",
         "Decision making in Python is accomplished using if, elif, and else statements. Python relies on proper indentation to define scope blocks rather than curly braces."),
        ("Control Flow: Loops and Iterations",
         "Python provides while loops and for loops. The for loop iterates over the items of any sequence such as lists, tuples, or strings. Loop control statements include break, continue, and pass."),
        ("Functions and Scope in Python",
         "Functions are defined using the def keyword. Python supports positional arguments, keyword arguments, default parameter values, and arbitrary argument lists (*args and **kwargs)."),
        ("Python Data Structures: Lists and Tuples",
         "Lists are mutable ordered sequences enclosed in square brackets. Tuples are immutable ordered sequences enclosed in parentheses. Both support indexing, slicing, and unpacking operations."),
        ("Python Data Structures: Dictionaries and Sets",
         "Dictionaries store key-value mappings with fast hash-based lookups. Sets are unordered collections of unique elements that support mathematical set operations like union and intersection."),
        ("String Manipulation and Regular Expressions",
         "Strings in Python are immutable sequences of Unicode characters. String methods include split, join, strip, replace, format, and f-strings for clean variable interpolation."),
        ("File Handling and Context Managers",
         "Python provides the open function to read and write files. Using the 'with' statement creates context managers that automatically close resources safely even when exceptions occur."),
        ("Error and Exception Handling",
         "Exceptions are handled using try, except, else, and finally blocks. Custom exceptions can be created by subclassing the built-in Exception class.")
    ]

    for i, (title, content) in enumerate(topics, start=1):
        story.append(Paragraph(f"Page {i} - {title}", title_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(content, body_style))
        story.append(Spacer(1, 15))
        story.append(Paragraph(f"Study Notes and Key Takeaways for Chapter {i}: Master the fundamentals before progressing to advanced object-oriented design and design patterns.", body_style))
        story.append(PageBreak())

    # Page 12 - Object Oriented Programming & Inheritance (Matches Assignment prompt example!)
    story.append(Paragraph("Page 12 - Object-Oriented Programming: Inheritance in Python", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("What is inheritance in Python?", h2_style))
    story.append(Paragraph(
        "Inheritance is a feature in Python that allows one class to acquire the properties and methods of another class. "
        "It helps in code reusability and creating relationships between classes.",
        body_style
    ))
    story.append(Paragraph(
        "The class whose properties and methods are inherited is known as the Parent class (or Superclass / Base class), "
        "while the class that inherits those properties is known as the Child class (or Subclass / Derived class).",
        body_style
    ))
    story.append(Paragraph("Syntax Example:", h2_style))
    story.append(Paragraph(
        "class Animal:<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;def speak(self):<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 'Generic animal sound'<br/><br/>"
        "class Dog(Animal):<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;def speak(self):<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 'Woof!'",
        code_style
    ))
    story.append(Paragraph(
        "Key Benefits of Inheritance:<br/>"
        "1. Code Reusability: Common functionality is written once in base classes and shared.<br/>"
        "2. Extensibility: Child classes can override methods or add new specialized features.<br/>"
        "3. Polymorphic Behavior: Derived classes can be used wherever their base classes are expected.",
        body_style
    ))
    story.append(PageBreak())

    # Page 13 - Polymorphism & Encapsulation
    story.append(Paragraph("Page 13 - Polymorphism and Encapsulation", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Polymorphism allows methods to perform different actions based on the object calling them. "
        "Encapsulation restricts direct access to some of an object's components using private and protected attributes.",
        body_style
    ))

    doc.build(story)
    print(f"Created: {output_path}")

def create_aws_notes(output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=12
    )
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#EA580C'),
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )

    story = []

    # Page 1: AWS Overview & Core Services (Matches Project 2 prompt)
    story.append(Paragraph("Page 1 - AWS Cloud Computing Architecture", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "AWS is a cloud computing platform that provides services such as EC2, S3, RDS and VPC. "
        "These services allow organizations to build and deploy applications without managing physical infrastructure.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Overview of Core AWS Services:", h2_style))
    story.append(Paragraph(
        "• <b>Cloud computing</b>: The on-demand delivery of IT resources over the internet with pay-as-you-go pricing.<br/>"
        "• <b>EC2</b> (Elastic Compute Cloud): Provides secure, resizable compute capacity in the cloud for running application servers.<br/>"
        "• <b>S3</b> (Simple Storage Service): An object storage service offering industry-leading scalability, data availability, and security.<br/>"
        "• <b>RDS</b> (Relational Database Service): Makes it easy to set up, operate, and scale relational databases such as PostgreSQL, MySQL, and Oracle.<br/>"
        "• <b>VPC</b> (Virtual Private Cloud): Enables you to launch AWS resources into a virtual network that you've defined with isolated subnets.",
        body_style
    ))
    story.append(PageBreak())

    # Page 2: Security, IAM, and Networking
    story.append(Paragraph("Page 2 - Security, IAM, and Scalability in AWS", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "AWS Identity and Access Management (IAM) enables administrators to securely manage access to AWS services and resources. "
        "Through IAM policies, roles, and multi-factor authentication, organizations maintain least-privilege security controls across cloud architectures.",
        body_style
    ))
    story.append(Paragraph(
        "Auto Scaling and Elastic Load Balancing automatically distribute incoming application traffic across multiple Amazon EC2 instances, "
        "ensuring fault tolerance and high availability under variable workloads.",
        body_style
    ))

    doc.build(story)
    print(f"Created: {output_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_dir = os.path.join(base_dir, 'sample_docs')
    create_python_notes(os.path.join(sample_dir, 'Python_Programming_Notes.pdf'))
    create_aws_notes(os.path.join(sample_dir, 'AWS_Cloud_Notes.pdf'))
