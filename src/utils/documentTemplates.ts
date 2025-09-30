// Template structure for bilingual documents
export const bilingualPolicyTemplate = {
  DocumentTitle: {
    English: 'Document Title (English)',
    Arabic: 'عنوان المستند (بالعربية)'
  },
  DocumentSections: [{
    SectionTitle: {
      English: 'Abbreviations',
      Arabic: 'الاختصارات'
    },
    Content: [{
      Term: {
        English: 'SAIB',
        Arabic: 'البنك السعودي للاستثمار'
      },
      FullForm: {
        English: 'Saudi Investment Bank',
        Arabic: 'البنك السعودي للاستثمار'
      }
    }]
  }, {
    SectionTitle: {
      English: 'Definitions',
      Arabic: 'التعريفات'
    },
    Content: [{
      Term: {
        English: 'Information Security',
        Arabic: 'أمن المعلومات'
      },
      Definition: {
        English: 'The practice of protecting information by mitigating information risks.',
        Arabic: 'ممارسة حماية المعلومات من خلال تخفيف مخاطر المعلومات.'
      }
    }]
  }, {
    SectionTitle: {
      English: 'Introduction',
      Arabic: 'مقدمة'
    },
    SubSections: [{
      Title: {
        English: 'Policy Definition',
        Arabic: 'تعريف السياسة'
      },
      Content: {
        English: 'This Policy defines the requirements for Information Security at SAIB.',
        Arabic: 'تحدد هذه السياسة متطلبات أمن المعلومات في البنك السعودي للاستثمار.'
      }
    }, {
      Title: {
        English: 'Purpose of this Policy',
        Arabic: 'الغرض من هذه السياسة'
      },
      Content: {
        English: "This Policy aims to protect the bank's information assets.",
        Arabic: 'تهدف هذه السياسة إلى حماية أصول المعلومات الخاصة بالبنك.'
      }
    }]
  }],
  Footer: {
    DocumentVersion: {
      English: 'Document Version: 1.0',
      Arabic: 'نسخة المستند: 1.0'
    },
    ApprovalDate: {
      English: 'Approval Date: March 2024',
      Arabic: 'تاريخ الموافقة: مارس 2024'
    }
  }
};

// Function to customize template with form data
export const customizeTemplate = (template: any, data: any) => {
  const customizedTemplate = JSON.parse(JSON.stringify(template));
  // Set document title
  customizedTemplate.DocumentTitle.English = data.title || 'Document Title';
  customizedTemplate.DocumentTitle.Arabic = data.title ? `${data.title} (بالعربية)` : 'عنوان المستند';
  return customizedTemplate;
};

// Enhanced function to generate bilingual document using Azure OpenAI
export const generateBilingualDocumentWithAI = async (azureOpenAIBaseUrl: string, azureOpenAIApiKey: string, formData: any, processModelContent: string = ''): Promise<string> => {
  try {
    // Create a structured prompt that instructs Azure OpenAI to follow the template format
    const templateStructure = JSON.stringify(bilingualPolicyTemplate, null, 2);
    // Enhanced prompt with stronger emphasis on bilingual requirements
    const prompt = `
You are tasked with generating a bilingual (English & Arabic) ${formData.category} document titled "${formData.title}".
CRITICAL INSTRUCTION: This document MUST be in BOTH English AND Arabic languages.
You MUST create content in BOTH English and Arabic for EVERY section following the EXACT structure of this JSON template:
${templateStructure}
Document Details:
- Category: ${formData.category}
- Source of Request: ${formData.sourceOfRequest}
- Justification: ${formData.justification}
- Additional Context: ${formData.additionalContext || 'None provided'}
${processModelContent ? 'Process Model Information:\n' + processModelContent : ''}
STRICT BILINGUAL REQUIREMENTS:
1. Your response MUST be a valid JSON object that follows the EXACT structure of the provided template
2. You MUST generate content for BOTH English AND Arabic for EVERY section and subsection
3. Use professional policy language and terminology in both languages
4. The Arabic translations must accurately convey the meaning of the English content
5. Include appropriate abbreviations, definitions, and policy statements relevant to ${formData.category}
6. DO NOT omit any sections or subsections from the template
7. DO NOT add any explanatory text before or after the JSON object
8. ENSURE that all content appears in both languages
If the document relates to Information Security, ensure you include:
- Security controls and requirements
- Authentication and access management
- Data protection measures
- Incident response procedures
- Compliance with SAMA cybersecurity framework
RESPOND ONLY WITH THE COMPLETED BILINGUAL JSON OBJECT.
`;
    // For debugging
    console.log('Sending prompt to Azure OpenAI:', prompt);
    // Make the API call to Azure OpenAI
    const response = await fetch(azureOpenAIBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIApiKey
      },
      body: JSON.stringify({
        messages: [{
          role: 'system',
          content: "You are an AI assistant specialized in generating professional bilingual (English & Arabic) policy and procedure documents for a Saudi bank. You are fluent in both English and Arabic, with expertise in financial, regulatory, and security terminology. Your task is to create well-structured, comprehensive bilingual documents following the bank's standards and incorporating all relevant regulatory requirements. You will generate content according to the exact JSON template structure provided, ensuring both languages are properly represented with high-quality translations."
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.4,
        // Lower temperature for more consistent output
        max_tokens: 14000 // Increased token limit to accommodate both languages
      })
    });
    if (!response.ok) {
      console.error(`Azure OpenAI API error: ${response.status} ${response.statusText}`);
      throw new Error(`Azure OpenAI API returned status ${response.status}`);
    }
    const responseData = await response.json();
    console.log('Azure OpenAI response received');
    // Extract the generated content from the response
    if (responseData && responseData.choices && responseData.choices.length > 0) {
      const generatedContent = responseData.choices[0].message.content;
      console.log('Content generated successfully, attempting to parse JSON');
      // Try to parse the JSON response
      try {
        // Extract JSON from the response (in case the AI included additional text)
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        const jsonContent = jsonMatch ? jsonMatch[0] : generatedContent;
        // Parse the JSON
        const generatedTemplate = JSON.parse(jsonContent);
        console.log('JSON parsed successfully');
        // Validate that the template has both English and Arabic content
        const hasEnglishContent = generatedTemplate.DocumentTitle && generatedTemplate.DocumentTitle.English;
        const hasArabicContent = generatedTemplate.DocumentTitle && generatedTemplate.DocumentTitle.Arabic;
        if (!hasEnglishContent || !hasArabicContent) {
          console.warn('Generated template is missing either English or Arabic content, using fallback');
          throw new Error('Generated template is missing required bilingual content');
        }
        // Generate markdown from the populated template
        return generateBilingualMarkdown(generatedTemplate);
      } catch (parseError) {
        console.error('Error parsing JSON from AI response:', parseError);
        // Create a more specific fallback template for Information Security policies
        if (formData.category.toLowerCase().includes('security') || formData.title.toLowerCase().includes('security')) {
          return generateInformationSecurityBilingualFallback(formData);
        }
        // If JSON parsing fails, use the original template with minimal customization
        const customizedTemplate = customizeTemplate(bilingualPolicyTemplate, formData);
        return generateBilingualMarkdown(customizedTemplate);
      }
    } else {
      throw new Error('No content received from Azure OpenAI API');
    }
  } catch (error) {
    console.error('Error in AI-generated bilingual document:', error);
    // Create a more specific fallback template for Information Security policies
    if (formData.category.toLowerCase().includes('security') || formData.title.toLowerCase().includes('security')) {
      return generateInformationSecurityBilingualFallback(formData);
    }
    // Fallback to the basic template method
    const customizedTemplate = customizeTemplate(bilingualPolicyTemplate, formData);
    return generateBilingualMarkdown(customizedTemplate);
  }
};

// Function to generate markdown from template - improved for better bilingual display
export const generateBilingualMarkdown = (template: any): string => {
  let markdown = ``;
  // Add document title with clear separation between languages
  markdown += `# ${template.DocumentTitle.English}\n`;
  markdown += `<div dir="rtl">\n\n# ${template.DocumentTitle.Arabic}\n\n</div>\n\n`;
  // Add sections
  template.DocumentSections.forEach((section: any) => {
    // English section title
    markdown += `## ${section.SectionTitle.English}\n\n`;
    // Arabic section title with RTL direction
    markdown += `<div dir="rtl">\n\n## ${section.SectionTitle.Arabic}\n\n</div>\n\n`;
    // Handle different section types
    if (Array.isArray(section.Content)) {
      // For tables like abbreviations and definitions
      if (section.SectionTitle.English === 'Abbreviations') {
        markdown += '| Term (English) | Full Form (English) |\n|---------------|--------------------|\n';
        section.Content.forEach((item: any) => {
          markdown += `| ${item.Term.English} | ${item.FullForm.English} |\n`;
        });
        markdown += '\n';
        // Arabic table with RTL direction
        markdown += '<div dir="rtl">\n\n';
        markdown += '| المصطلح | الشكل الكامل |\n|---------|------------|\n';
        section.Content.forEach((item: any) => {
          markdown += `| ${item.Term.Arabic} | ${item.FullForm.Arabic} |\n`;
        });
        markdown += '\n</div>\n\n';
      } else if (section.SectionTitle.English === 'Definitions') {
        markdown += '| Term (English) | Definition (English) |\n|---------------|----------------------|\n';
        section.Content.forEach((item: any) => {
          markdown += `| ${item.Term.English} | ${item.Definition.English} |\n`;
        });
        markdown += '\n';
        // Arabic table with RTL direction
        markdown += '<div dir="rtl">\n\n';
        markdown += '| المصطلح | التعريف |\n|---------|--------|\n';
        section.Content.forEach((item: any) => {
          markdown += `| ${item.Term.Arabic} | ${item.Definition.Arabic} |\n`;
        });
        markdown += '\n</div>\n\n';
      }
    } else if (section.SubSections) {
      // For sections with subsections
      section.SubSections.forEach((subsection: any) => {
        // English subsection
        markdown += `### ${subsection.Title.English}\n\n${subsection.Content.English}\n\n`;
        // Arabic subsection with RTL direction
        markdown += `<div dir="rtl">\n\n### ${subsection.Title.Arabic}\n\n${subsection.Content.Arabic}\n\n</div>\n\n`;
      });
    } else if (section.Content && typeof section.Content === 'object') {
      // For simple content sections
      markdown += `${section.Content.English}\n\n`;
      markdown += `<div dir="rtl">\n\n${section.Content.Arabic}\n\n</div>\n\n`;
    }
  });
  // Add footer
  markdown += '---\n\n';
  markdown += `**${template.Footer.DocumentVersion.English}**  \n`;
  markdown += `**${template.Footer.ApprovalDate.English}**\n\n`;
  markdown += `<div dir="rtl">\n\n**${template.Footer.DocumentVersion.Arabic}**  \n`;
  markdown += `**${template.Footer.ApprovalDate.Arabic}**\n\n</div>\n`;
  return markdown;
};

// Fallback function specifically for Information Security policies
const generateInformationSecurityBilingualFallback = (formData: any): string => {
  const template = {
    DocumentTitle: {
      English: formData.title || 'Information Security Policy',
      Arabic: 'سياسة أمن المعلومات'
    },
    DocumentSections: [{
      SectionTitle: {
        English: 'Abbreviations',
        Arabic: 'الاختصارات'
      },
      Content: [{
        Term: {
          English: 'SAIB',
          Arabic: 'البنك السعودي للاستثمار'
        },
        FullForm: {
          English: 'Saudi Investment Bank',
          Arabic: 'البنك السعودي للاستثمار'
        }
      }, {
        Term: {
          English: 'SAMA',
          Arabic: 'ساما'
        },
        FullForm: {
          English: 'Saudi Central Bank',
          Arabic: 'البنك المركزي السعودي'
        }
      }, {
        Term: {
          English: 'MFA',
          Arabic: 'المصادقة متعددة العوامل'
        },
        FullForm: {
          English: 'Multi-Factor Authentication',
          Arabic: 'المصادقة متعددة العوامل'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Definitions',
        Arabic: 'التعريفات'
      },
      Content: [{
        Term: {
          English: 'Information Security',
          Arabic: 'أمن المعلومات'
        },
        Definition: {
          English: 'The practice of protecting information by mitigating information risks.',
          Arabic: 'ممارسة حماية المعلومات من خلال تخفيف مخاطر المعلومات.'
        }
      }, {
        Term: {
          English: 'Cybersecurity',
          Arabic: 'الأمن السيبراني'
        },
        Definition: {
          English: 'The practice of protecting systems, networks, and programs from digital attacks.',
          Arabic: 'ممارسة حماية الأنظمة والشبكات والبرامج من الهجمات الرقمية.'
        }
      }, {
        Term: {
          English: 'Multi-Factor Authentication',
          Arabic: 'المصادقة متعددة العوامل'
        },
        Definition: {
          English: 'A security process that requires users to provide two or more verification factors to gain access to a resource.',
          Arabic: 'عملية أمنية تتطلب من المستخدمين تقديم عاملين أو أكثر من عوامل التحقق للوصول إلى مورد.'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Introduction',
        Arabic: 'مقدمة'
      },
      SubSections: [{
        Title: {
          English: 'Policy Definition',
          Arabic: 'تعريف السياسة'
        },
        Content: {
          English: "This Information Security Policy defines the requirements and controls for protecting SAIB's information assets in accordance with SAMA's cybersecurity framework and regulatory requirements.",
          Arabic: 'تحدد سياسة أمن المعلومات هذه المتطلبات والضوابط اللازمة لحماية أصول المعلومات الخاصة بالبنك السعودي للاستثمار وفقًا لإطار الأمن السيبراني والمتطلبات التنظيمية للبنك المركزي السعودي (ساما).'
        }
      }, {
        Title: {
          English: 'Purpose of this Policy',
          Arabic: 'الغرض من هذه السياسة'
        },
        Content: {
          English: "This Policy aims to establish a comprehensive framework for securing SAIB's information systems, data, and technology infrastructure against internal and external threats while ensuring compliance with regulatory requirements.",
          Arabic: 'تهدف هذه السياسة إلى إنشاء إطار شامل لتأمين أنظمة المعلومات والبيانات والبنية التحتية التكنولوجية للبنك السعودي للاستثمار ضد التهديدات الداخلية والخارجية مع ضمان الامتثال للمتطلبات التنظيمية.'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Authentication and Access Control',
        Arabic: 'المصادقة والتحكم في الوصول'
      },
      SubSections: [{
        Title: {
          English: 'Multi-Factor Authentication Requirements',
          Arabic: 'متطلبات المصادقة متعددة العوامل'
        },
        Content: {
          English: 'SAIB shall implement multi-factor authentication for all access to critical systems and sensitive data. Different user roles shall have specific authentication requirements based on their access levels and responsibilities.',
          Arabic: 'سينفذ البنك السعودي للاستثمار المصادقة متعددة العوامل لجميع عمليات الوصول إلى الأنظمة الحساسة والبيانات الحساسة. ستكون لأدوار المستخدمين المختلفة متطلبات مصادقة محددة بناءً على مستويات الوصول الخاصة بهم ومسؤولياتهم.'
        }
      }, {
        Title: {
          English: 'Access Management',
          Arabic: 'إدارة الوصول'
        },
        Content: {
          English: 'Access to information systems and data shall be granted based on the principle of least privilege. Regular access reviews shall be conducted to ensure appropriate access rights are maintained.',
          Arabic: 'يتم منح الوصول إلى أنظمة المعلومات والبيانات على أساس مبدأ الامتياز الأقل. سيتم إجراء مراجعات منتظمة للوصول لضمان الحفاظ على حقوق الوصول المناسبة.'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Cloud Security',
        Arabic: 'أمن السحابة'
      },
      SubSections: [{
        Title: {
          English: 'Cloud Security Standards',
          Arabic: 'معايير أمن السحابة'
        },
        Content: {
          English: "SAIB shall implement comprehensive security controls for all cloud services in accordance with SAMA's cloud security requirements. These include data encryption, access controls, monitoring, and incident response capabilities.",
          Arabic: 'سينفذ البنك السعودي للاستثمار ضوابط أمنية شاملة لجميع خدمات السحابة وفقًا لمتطلبات أمن السحابة الخاصة بالبنك المركزي السعودي. وتشمل هذه تشفير البيانات، وضوابط الوصول، والمراقبة، وقدرات الاستجابة للحوادث.'
        }
      }, {
        Title: {
          English: 'Cloud Service Provider Requirements',
          Arabic: 'متطلبات مزود خدمة السحابة'
        },
        Content: {
          English: "Cloud service providers must be assessed and approved before use. They must comply with SAIB's security requirements and applicable regulatory standards.",
          Arabic: 'يجب تقييم مزودي خدمات السحابة والموافقة عليهم قبل الاستخدام. يجب أن يمتثلوا لمتطلبات الأمان الخاصة بالبنك السعودي للاستثمار والمعايير التنظيمية المعمول بها.'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Incident Response',
        Arabic: 'الاستجابة للحوادث'
      },
      SubSections: [{
        Title: {
          English: 'Incident Response Procedures',
          Arabic: 'إجراءات الاستجابة للحوادث'
        },
        Content: {
          English: 'SAIB shall maintain a comprehensive incident response plan that defines procedures for identifying, reporting, containing, eradicating, recovering from, and learning from security incidents.',
          Arabic: 'سيحتفظ البنك السعودي للاستثمار بخطة شاملة للاستجابة للحوادث تحدد إجراءات تحديد الحوادث الأمنية والإبلاغ عنها واحتوائها والقضاء عليها والتعافي منها والتعلم منها.'
        }
      }, {
        Title: {
          English: 'Incident Reporting',
          Arabic: 'الإبلاغ عن الحوادث'
        },
        Content: {
          English: 'All security incidents must be reported to the Information Security team immediately. Critical incidents must be reported to SAMA within the timeframes specified in the regulatory requirements.',
          Arabic: 'يجب الإبلاغ عن جميع الحوادث الأمنية إلى فريق أمن المعلومات على الفور. يجب الإبلاغ عن الحوادث الحرجة إلى البنك المركزي السعودي (ساما) خلال الأطر الزمنية المحددة في المتطلبات التنظيمية.'
        }
      }]
    }, {
      SectionTitle: {
        English: 'Compliance',
        Arabic: 'الامتثال'
      },
      SubSections: [{
        Title: {
          English: 'Regulatory Compliance',
          Arabic: 'الامتثال التنظيمي'
        },
        Content: {
          English: "SAIB shall comply with all applicable regulatory requirements, including SAMA's Cybersecurity Framework, to ensure the protection of information assets and customer data.",
          Arabic: 'سيمتثل البنك السعودي للاستثمار لجميع المتطلبات التنظيمية المعمول بها، بما في ذلك إطار الأمن السيبراني للبنك المركزي السعودي، لضمان حماية أصول المعلومات وبيانات العملاء.'
        }
      }, {
        Title: {
          English: 'Compliance Monitoring',
          Arabic: 'مراقبة الامتثال'
        },
        Content: {
          English: 'Regular assessments and audits shall be conducted to verify compliance with this policy and regulatory requirements. Any non-compliance issues shall be addressed promptly.',
          Arabic: 'سيتم إجراء تقييمات ومراجعات منتظمة للتحقق من الامتثال لهذه السياسة والمتطلبات التنظيمية. سيتم معالجة أي مشكلات عدم امتثال على الفور.'
        }
      }]
    }],
    Footer: {
      DocumentVersion: {
        English: 'Document Version: 1.0',
        Arabic: 'نسخة المستند: 1.0'
      },
      ApprovalDate: {
        English: 'Approval Date: March 2024',
        Arabic: 'تاريخ الموافقة: مارس 2024'
      }
    }
  };
  return generateBilingualMarkdown(template);
};